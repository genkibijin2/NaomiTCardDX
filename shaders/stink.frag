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


void main() {
    //shadertoy Conversion
    vec2 iResolution = vec2(u_resolution.xy);
    float iTime = float(u_time);
    vec2 fragCoord = gl_FragCoord.xy;
    
//Screen setup (interlacing, resolution, pixelation etc)
    vec2 uv = fragCoord/iResolution.xy;
    vec3 color = vec3(.0);
    float aspectRatio = iResolution.x / iResolution.y;
    uv.x *= aspectRatio;
    uv.x -= (aspectRatio - 1.) * .5;
    float pixelz = 90.;
    uv.x = floor(uv.x * pixelz) / pixelz;
    uv.y = floor(uv.y * pixelz) / pixelz;
    pixelz = 90.;
    uv.x = floor(uv.x * pixelz) / pixelz;
    uv.y = floor(uv.y * pixelz) / pixelz;
    if (mod(fragCoord.y, 2.) < 1.) {
        uv += .4 + sin(iTime * 0.476 + uv.y * 14.984) * (0.068*iTime*0.1);
    } else {
        uv -= .4 + cos(iTime * .5 + uv.y * 15.104 + .5) * sin(-0.076*11.808);
    }
//==END OF SCREEN SETUP==\\
   
//Da Fart

    color = vec3(uv.x, uv.y, sin(iTime*0.1));

   
 if (sin(uv.x*iTime*sin(-0.464)) > 0.2){
      if (iTime > 0.0 && iTime < 60.0){
          color = vec3(sin(iTime*0.108));
          color = color - vec3(0.0, 0.0, 10.0);
      }
      else{
        color = vec3(0.576,0.975,0.252);
        }
    }
    else{
        float RpulseWorld = (log(iTime)*sin(uv.x));
        float GpulseWorld = (sin(uv.y)*uv.x*(iTime*-0.716));
        float BpulseWorld = sin(iTime);
        float RpulseClamped = clamp(RpulseWorld, GpulseWorld, 0.020);
       

        
     
       
    color = vec3(RpulseClamped, GpulseWorld, BpulseWorld);
        }
    //Palette Clampage
    float clampage = 8.0;
    color = ceil(color * clampage) / clampage;
    color = color - vec3(0.8, 0, 0.0);
    gl_FragColor = vec4(color, 1.);

}
