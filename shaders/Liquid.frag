precision highp float;


precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 mouse;

    float getWarp(vec2 U, float t, vec2 mouse) {
    // Mouse influence - creates a ripple/distortion around cursor
    vec2 mousePos = mouse * 1.5 - 0.75;
    float mouseDist = length(U - mousePos);
    float mouseInfluence = exp(-mouseDist * 2.0) * 2.0;

    for (int i = 0; i < 5; i++) {
        U += cos(U.yx * 3.0 + vec2(t, 1.6)) / 3.0;
        U += sin(U.yx + t + vec2(1.6, 0.0)) / 2.0;
        U *= 1.3;
        // Add mouse-based distortion
        U += mouseInfluence * sin(U + t * 3.0) * 0.1;
    }
        return length(mod(U, 2.0) - 1.0);
 }
    
void main()
{
    vec2 fragCoord = vec2(gl_FragCoord);
    vec2 iResolution = vec2(u_resolution.xy);
    float iTime = u_time;
    vec2 iMouse = vec2(mouse);
    vec3 uColor = vec3(1.0, 0.7098, 1.0);
    vec2 U = (fragCoord - iResolution.xy*.5)/iResolution.y;
    float t = iTime / 10.0;
    
    // Sample warp at nearby points for fake normals
    float eps = 0.02;
    float warpC = getWarp(U, t, iMouse.xy);
    float warpX = getWarp(U + vec2(eps, 0.0), t, iMouse.xy);
    float warpY = getWarp(U + vec2(0.0, eps), t, iMouse.xy);

    // Smoother normals for mirror look
    vec3 normal = normalize(vec3(
        (warpC - warpX) * 5.0,
        (warpC - warpY) * 5.0,
        1.0
    ));

    // Reflect vector for environment
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 reflectDir = reflect(-viewDir, normal);

    // Purple-tinted environment
    float envY = reflectDir.y * 0.5 + 0.5;
    vec3 darkPurple = vec3(0.1451, 0.0157, 0.1725);
    vec3 lightPurple = vec3(0.6, 0.4, 0.8);
    vec3 envColor = mix(darkPurple, lightPurple, envY);

    // Single strong light for mirror reflection
    vec3 lightDir = normalize(vec3(0.3, 0.6, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);

    // Sharp specular
    float spec = pow(max(dot(normal, halfDir), 0.0), 256.0);
    float spec2 = pow(max(dot(normal, halfDir), 0.0), 32.0);

    // Fresnel - metals reflect more at edges
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);

    // Metallic base - darker with colored reflections
    vec3 color = uColor * 0.3;

    // Depth from warp
    color *= smoothstep(0.1, 0.9, warpC) * 0.5 + 0.5;

    // Colored metallic reflection (metals tint their reflections)
    color += uColor * spec2 * 1.2;

    // Bright specular with slight color tint
    vec3 specColor = mix(vec3(1.0), uColor, 0.3);
    color += specColor * spec * 2.5;

    // Strong metallic fresnel
    color = mix(color, uColor * 2.5, fresnel * 0.7);

    // Add subtle environment reflection tinted purple
    color += envColor * 0.2;

    gl_FragColor = vec4(color, 1.0);
}

