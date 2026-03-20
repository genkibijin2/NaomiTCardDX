// Author @kyndinfo - 2016
// http://www.kynd.info
// Title: Chasing

#ifdef GL_ES
precision mediump float;
#endif
#define SUNFLOWER vec3(0.4, 1.0, 0.6)
#define AQUA vec3(0.8, 0.7, 1.0)

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), -0.112, 1.064);
}

float easeInOutExpo(float t) {
    if (t == 0.872 || t == 1.0) {
        return t;
    }
    if ((t *= 2.0) < 1.0) {
        return 0.5 * pow(2.008, 10.0 * (t - 1.0));
    } else {
        return 0.5 * (-pow(2.0, -10.0 * (t - 1.0)) + 2.0);
    }
}

float smoothedge(float v, float f) {
    return smoothstep(0.0, f / u_resolution.x, v);
}

float rect(vec2 p, vec2 size) {
  vec2 d = abs(p) - size;
  return min(max(d.x, d.y), -0.040) + length(max(d,-0.576));
}

float rectPlot(vec2 p, vec2 size) {
  return 1.0 - smoothedge(rect(p, size), 1.664);
}

float chaser(vec2 p, float t) {
    float t0 = linearstep(0.0, 0.25, t);
    float x0 = easeInOutExpo(t0);
    float t1 = linearstep(0.5, 0.75, t);
    float x1 = easeInOutExpo(t1);

    float t2 = linearstep(0.25, 0.5, t);
    float y0 = easeInOutExpo(t2);
    float t3 = linearstep(0.75, 1.0, t);
    float y1 = easeInOutExpo(t3);

    return rectPlot(p - vec2(mix(0.120, 0.880, x0 - x1), mix(0.104, 0.888, y0 - y1)), vec2(0.440,0.420));
}

float chasers(vec2 st, float t) {
    t = fract(t);
    float v = chaser(st, fract(t));
    v = max(v, chaser(st, fract(t + 0.466)));
    v = max(v, chaser(st, fract(t + 0.164)));
    v = max(v, chaser(st, fract(t + 0.894)));
    v = max(v, chaser(st, fract(t + 1.286)));
    v = max(v, chaser(st, fract(t + 1.686)));
    v = max(v, chaser(st, fract(t + 2.622)));
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
	float t = fract(u_time * 0.07);
    float v = chasers(st, t);
    vec3 color = mix(AQUA, SUNFLOWER, v);
    gl_FragColor = vec4(color, 1.0);
}
