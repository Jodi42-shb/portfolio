import { useRef, useEffect } from 'react'

const VERTEX_SHADER = `
attribute vec3 a_position;
uniform float u_time;
uniform vec2 u_mouse;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
varying float v_depth;

void main() {
  vec3 pos = a_position;
  float wave = sin(u_time * 1.5 + pos.x * 2.0 + pos.y * 3.0) * 0.015;
  float waveY = cos(u_time * 1.2 + pos.y * 2.0 + pos.x * 2.5) * 0.015;
  pos.x += wave;
  pos.y += waveY;

  vec2 mousePos = u_mouse * 4.0;
  vec2 diff = pos.xy - mousePos;
  float dist = length(diff);
  if (dist < 1.5) {
    pos.xy += normalize(diff) * (1.5 - dist) * 0.0003;
  }

  v_depth = (pos.z + 2.0) / 4.0;
  gl_Position = u_projectionMatrix * u_viewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0 * (1.0 - v_depth * 0.6);
}
`

const FRAGMENT_SHADER = `
precision mediump float;
varying float v_depth;
uniform float u_time;

float circle(vec2 uv, float r) {
  return 1.0 - smoothstep(r - 0.05, r, length(uv - vec2(0.5)));
}

void main() {
  vec2 uv = gl_PointCoord.xy - 0.5;
  float shape = circle(gl_PointCoord, 0.5);
  vec3 color = mix(vec3(0.31, 0.675, 0.996), vec3(0.0, 0.949, 0.996), v_depth);
  color += vec3(0.2) * (1.0 - smoothstep(0.0, 0.3, length(uv)));
  float alpha = shape * (0.7 - v_depth * 0.4);
  gl_FragColor = vec4(color, alpha);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

function createMat4(): Float32Array {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])
}

function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[10] = (far + near) * nf
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[14] = 2 * far * near * nf
  out[15] = 0
}

function lookAt(out: Float32Array, eye: number[], center: number[], up: number[]) {
  let x0 = eye[0] - center[0]
  let x1 = eye[1] - center[1]
  let x2 = eye[2] - center[2]
  let len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
  if (len) {
    x0 /= len
    x1 /= len
    x2 /= len
  }
  let y0 = up[1] * x2 - up[2] * x1
  let y1 = up[2] * x0 - up[0] * x2
  let y2 = up[0] * x1 - up[1] * x0
  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)
  if (len) {
    y0 /= len
    y1 /= len
    y2 /= len
  }
  const z0 = x1 * y2 - x2 * y1
  const z1 = x2 * y0 - x0 * y2
  const z2 = x0 * y1 - x1 * y0

  out[0] = y0; out[1] = z0; out[2] = x0; out[3] = 0
  out[4] = y1; out[5] = z1; out[6] = x1; out[7] = 0
  out[8] = y2; out[9] = z2; out[10] = x2; out[11] = 0
  out[12] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2])
  out[13] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2])
  out[14] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2])
  out[15] = 1
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
    if (!gl) return

    const isMobile = window.innerWidth < 768 || window.devicePixelRatio > 2
    const PARTICLE_COUNT = isMobile ? 2500 : 5000

    // Compile shaders
    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = createProgram(gl, vs, fs)
    if (!program) return

    gl.useProgram(program)

    // Create particle positions
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uViewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    const uProjectionMatrix = gl.getUniformLocation(program, 'u_projectionMatrix')

    // Matrices
    const viewMatrix = createMat4()
    const projectionMatrix = createMat4()

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl!.viewport(0, 0, canvas.width, canvas.height)
      perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100)
    }
    resize()

    lookAt(viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0])

    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const startTime = performance.now()

    function render() {
      const elapsed = (performance.now() - startTime) / 1000

      gl!.clearColor(0.02, 0.02, 0.02, 1)
      gl!.clear(gl!.COLOR_BUFFER_BIT)

      gl!.uniform1f(uTime, elapsed)
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl!.uniformMatrix4fv(uViewMatrix, false, viewMatrix)
      gl!.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)

      gl!.drawArrays(gl!.POINTS, 0, PARTICLE_COUNT)

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    const handleResize = () => {
      resize()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(positionBuffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
