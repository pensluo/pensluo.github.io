/* pass interpolated variables to from the vertex */
varying vec2 v_uv;
varying vec3 v_normal;
uniform float time;

void main()
{
    vec3 nhat = normalize(v_normal);
    vec3 baseColor = vec3(0,1,1);
    float wiggle = .5*sin((1.-v_uv.x)*(1.-v_uv.y)*100.)*(sin(v_uv.x*20.)) * cos((1.-v_uv.x)*(1.-v_uv.x)*13.)*(cos(v_uv.x*24.));
    float darkness = .5*clamp(wiggle, -1., 0.);
    vec3 color = clamp(baseColor+vec3(.5+wiggle,.5+wiggle,.5+wiggle),0.,1.);
    float alpha = .4;
    gl_FragColor = vec4(color,alpha);
}