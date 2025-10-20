/* pass interpolated variables to the fragment */
varying vec2 v_uv;
uniform float time;
varying vec3 v_normal;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // we know the direction from the normal (which should be a unit vector)
    
    // increase and decrease quadratically over time * grow/shrink at the base depending on v and time * wiggle
    float disp = .1*sin((1.-uv.y)*(1.-uv.y)*100.)*(sin(uv.x*20.));
    vec3 pos = position + disp*normal;

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    v_uv = uv;
    v_normal = normalMatrix * normal;
}