precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;



vec2 shift(vec2 p, vec2 d){
    return p - d;
}

vec2 spin(vec2 p, float a){
    float c = cos(a), s = sin(a);
    return mat2(c,-s,s,c) * p;
}

float sdfCircle(vec2 p, float r){
    return length(p) - r;
}

float sdfRect(vec2 p, vec2 b){
    vec2 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0);
}

float smoothMin(float a, float b, float k){
    float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
    return mix(b,a,h) - k*h*(1.0-h);
}

float waveDist(vec2 p, float d, float f, float spd, float amp){
    float iTime = u_time*0.2;
    return d + sin(p.x*f + iTime*spd) * amp;
}

vec2 uvNorm(vec2 fc){
    vec2 iResolution = u_resolution.xy;
    return (2.0*fc - iResolution.xy) / iResolution.y;
}

void paint(inout vec3 base, vec3 ink, float d, float blur){
    float a = smoothstep(blur, blur, d);
    base = mix(ink, base, a);
}

void drawCloud(vec2 uv, inout vec3 col, float y, float drift, float seed){
   
}

void drawSea(vec2 uv, inout vec3 col, float h, float freq, float spd, vec3 tone){
    float base = sdfRect(shift(uv, vec2(0.0,-h)), vec2(4.0,0.6));
    float d = waveDist(uv, base, freq, -spd, 0.03 + h*0.015);
    paint(col, tone, d, 0.015);
}

void main(){
    vec2 fragCoord = vec2(gl_FragCoord);
    vec2 iResolution = vec2(u_resolution.xy);
    float iTime = u_time;
    vec2 uv = uvNorm(fragCoord);
    vec3 col = vec3(0.0);

    float g = smoothstep(-1.0, 1.0, uv.y);
    vec3 skyLow = vec3(0.0588, 0.8941, 0.7961);
    vec3 skyHigh = vec3(0.7137, 0.9412, 0.9294);
    col = mix(skyHigh, skyLow, g);

    vec2 sunPos = vec2(0.970,0.980);
    sunPos.y += sin(iTime * 0.0) * 0.015;

    vec2 p = uv - sunPos;
    float r = length(p);
    float ang = atan(p.y, p.x);

    float flare = sin(ang * 14.568 + iTime * 1.2) * 0.02
                + sin(ang * 7.0  - iTime * 0.7) * 0.01;

    float sunShape = r - (0.052 + flare);
    float core = smoothstep(0.02, -0.02, sunShape);

    vec3 sunColor = vec3(1.000,0.950,0.981);
    //col = mix(col, sunColor, core);

    float glow = pow(clamp(0.920 - r / 0.45, 0.0, 1.0), 2.668);
   // col += sunColor * glow * 0.6;

    drawSea(uv, col, 0.6, 5.5, 1.2, vec3(0.6157, 0.9333, 0.8392));
    drawSea(uv, col, 0.9, 3.8, 1.8, vec3(0.3922, 0.8863, 0.7608));
    drawSea(uv, col, 1.2, 2.4, 3.0, vec3(0.1529, 0.5725, 0.4824));

    gl_FragColor = vec4(col,1.0);
}
