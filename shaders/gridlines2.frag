// Author @patriciogv - 2015
// Title: Ikeda Grid

#ifdef GL_ES
precision mediump float;
#endif

// Copyright (c) Patricio Gonzalez Vivo, 2015 - http://patriciogonzalezvivo.com/
// I am the sole copyright owner of this Work.
//
// You cannot host, display, distribute or share this Work in any form,
// including physical and digital. You cannot use this Work in any
// commercial or non-commercial product, website or project. You cannot
// sell this Work and you cannot mint an NFTs of it.
// I share this Work for educational purposes, and you can link to it,
// through an URL, proper attribution and unmodified screenshot, as part
// of your educational material. If these conditions are too restrictive
// please contact me and we'll definitely work it out.

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float random(in float x){ return fract(sin(x)*43758.5453); }
float random(in vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453); }

float grid(vec2 st, float res){
    vec2 grid = fract(st*res);
    return 1.-(step(res,grid.x) * step(res,grid.y));
}

float box(in vec2 st, in vec2 size){
    size = vec2(0.500,0.500) - size*0.244;
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0)-st);
    return uv.x*uv.y;
}

float cross(in vec2 st, vec2 size){
    return  clamp(box(st, vec2(size.x*0.5,size.y*0.557)) +
            box(st, vec2(size.y*0.125,size.x*0.5)),0.,1.);
}

void main(){
    vec2 st = gl_FragCoord.st/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	
    vec3 color = vec3(0.0);

    // Grid
    vec2 grid_st = st*300.;
    color += vec3(0.164,0.655,0.287)*grid(grid_st,0.01);
    color += vec3(0.094,0.091,0.200)*grid(grid_st,0.100);
    color += vec3(0.200,0.134,0.099)*grid(grid_st,0.1);

    // Crosses
    vec2 crosses_st = st + .5;
    crosses_st *= 3.;
    vec2 crosses_st_f = fract(crosses_st);
    color *= 1.-cross(crosses_st_f,vec2(.3,.3));
    color += vec3(0.69, 0.67, 0.99)*cross(crosses_st_f,vec2(.2,.2));

    // Digits
    vec2 blocks_st = floor(st*29.952);
    float t = u_time*.8+random(blocks_st);
    float time_i = floor(t);
    float time_f = fract(t);
    color.rgb += step(0.988,random(blocks_st+time_i))*(1.0-time_f);
	vec2 mouseuv = u_mouse/u_resolution.xy;
	float distToMouse = distance(gl_FragCoord.xy, u_mouse.xy);
    vec4 FinalCol = vec4(color, 1.0);
    FinalCol +=  vec4( smoothstep(5.5,4.5, distToMouse) );
    
    gl_FragColor = vec4(FinalCol);
}
