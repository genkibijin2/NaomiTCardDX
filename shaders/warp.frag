// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.392*(sin(u_time/100.00));
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

void main() {
     float pixelz = 900.;
    vec2 uv = (gl_FragCoord.xy/u_resolution.xy);
    float aspectRatio = (u_resolution.x / u_resolution.y);
     uv.x *= aspectRatio;
    uv.x -= (aspectRatio - 1.) * .5;
    uv.x = floor(uv.x * pixelz) / pixelz;
    uv.y = floor(uv.y * pixelz) / pixelz;
    pixelz = 900.;
    uv.x = floor(uv.x * pixelz) / pixelz;
    uv.y = floor(uv.y * pixelz) / pixelz;
    uv.x *= aspectRatio;
    uv.x -= (aspectRatio - 1.0) * .5;
    if (mod(gl_FragCoord.y, 2.) < 1.) {
        uv += uv.y +.4 * sin(u_time) * 0.1;
        uv.y += uv.y +.3 *sin(u_time) * 0.1;
    } else {
        uv -= uv.x -.9 - cos(u_time) * 0.1;
        uv.x -= uv.x *2.0-1.0;
    }
    vec2 st = uv;
    st.y *= aspectRatio;
    st.x *= aspectRatio;

    vec2 pos = st.yx*vec2(10.,3.);

    float pattern = pos.x;

    // Add noise
    pos = rotate2d( noise(pos) ) * pos;

    // Draw lines
    pattern = lines(pos,-0.444);

    gl_FragColor = vec4(vec3(pattern),1.0);
}
