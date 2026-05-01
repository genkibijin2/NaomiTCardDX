#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);

float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.769;
}

float pattern( in vec2 p, float iTime) {
  vec2 q = vec2(fbm(p + vec2(0.0,0.0)));
  vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2)));
  r+= iTime * 0.15;
  return fbm( p + 1.760*r );
}

void main() {
    vec2 iResolution = u_resolution;
    float iTime = u_time;
  	vec2 uv = gl_FragCoord.xy/iResolution.xy;
    uv *= 4.5; // Scale UV to make it nicer in that big screen !
  	float displacement = pattern(uv, iTime);
  	vec4 color = vec4(displacement * 1.2, 0.6, displacement * 5., 1.);
    color.a = min(color.r * 1.85, 1.); // Depth for CineShader
    gl_FragColor = color;
}