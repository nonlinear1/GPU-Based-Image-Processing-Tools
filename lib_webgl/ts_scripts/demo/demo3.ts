/* =========================================================================
 *
 *  demo3.ts
 *  test some webgl demo
 *  
 * ========================================================================= */
/// <reference path="../lib/webgl_matrix.ts" />
/// <reference path="../lib/webgl_utils.ts" />
/// <reference path="../lib/webgl_shaders.ts" />

var canvas = <any>document.getElementById('canvas');
canvas.width = 300;
canvas.height = 300;
try {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
} catch (e) {}
if (!gl)
    throw new Error("Could not initialise WebGL");

var cnt =0;

var shader     = new EcognitaMathLib.WebGL_Shader(Shaders, "demo1-vert", "demo1-frag");

var vbo = new EcognitaMathLib.WebGL_VertexBuffer();

vbo.addAttribute("position", 3, gl.FLOAT, false);
vbo.addAttribute("color", 4, gl.FLOAT, false);
vbo.init(3);

vbo.copy([0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
         -1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0]);

vbo.bind(shader);
var m = new EcognitaMathLib.WebGLMatrix();

var mMatrix = m.identity(m.create());
var vMatrix = m.viewMatrix([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0]);
var pMatrix = m.perspectiveMatrix(90, canvas.width / canvas.height, 0.1, 100);
var tmpMatrix = m.multiply(pMatrix, vMatrix);
mMatrix =m.translate(mMatrix,[1.5,0.0,0.0]);
var mvpMatrix = m.multiply(tmpMatrix, mMatrix);

shader.bind();
var uniLocation = new Array<any>();
uniLocation.push(shader.uniformIndex('mvpMatrix'));

(function(){

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        cnt++;
        var rad = (cnt%360) * Math.PI/180;
        var x = Math.cos(rad);
        var y = Math.sin(rad);
    
        //draw first triangle animation
        mMatrix =m.identity(mMatrix);
        mMatrix =m.translate(mMatrix,[x,y+1.0,0.0]);
        mvpMatrix = m.multiply(tmpMatrix, mMatrix);
        gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
        vbo.draw(gl.TRIANGLES);
    
        //draw second triangle animation
        mMatrix =m.identity(mMatrix);
        mMatrix =m.translate(mMatrix,[1.0,-1.0,0.0]);
        mMatrix =m.rotate(mMatrix,rad,[0,1,0]);
        mvpMatrix = m.multiply(tmpMatrix, mMatrix);
        gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
        vbo.draw(gl.TRIANGLES);
    
        //draw third triangle animation
        var s = Math.sin(rad)+1.0;
        mMatrix =m.identity(mMatrix);
        mMatrix =m.translate(mMatrix,[-1.0,-1.0,0.0]);
        mMatrix =m.scale(mMatrix,[s,s,0.0]);
        mvpMatrix = m.multiply(tmpMatrix, mMatrix);
        gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
        vbo.draw(gl.TRIANGLES);
        gl.flush();
        setTimeout(arguments.callee, 1000 / 30);
})();