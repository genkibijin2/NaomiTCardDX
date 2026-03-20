precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
    vec2 fragCoord = vec2(gl_FragCoord);
    vec2 iResolution = vec2(u_resolution.xy);
    float iTime = u_time;
    vec2 uv =  (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
   
    for(float i = 1.0; i < 8.0; i++){
    uv.y += i * 0.1 / i * 
      sin(uv.x * i * i + iTime * 0.5) * sin(uv.y * i * i + iTime * 0.5);
  }
    
   vec3 col;
   col.r  = uv.y - 0.1;
   col.g = uv.y + 0.3;
   col.b = uv.y + 0.95;
   vec3 col2 = vec3(0.8549, 0.6863, 0.9686);
   col = mix(col, col2, 0.7);
    
    gl_FragColor = vec4(col,1.0);
}