var prop;
var old_accuracy;
var old_type;
var width, height;
var pointSize=2;

function inv_cdr( Accuracy, xi ) {
	b = 3; // curve constant
	// PDF_1(x) = (b+1)x^b
	return (1-Accuracy)*xi + Accuracy * Math.pow( xi, 1/(1+b) );
}

function inv_cdr_polar( Accuracy, xi ) {
	b = 2; // curve constant
	// PDF_1(x) = b/2pi * r^((1-b)/b)
	return (1-Accuracy)*Math.sqrt(xi) + Accuracy * Math.pow( xi, b);
}

function drawLinearFunction( Accuracy, loop ) {
	context1.clearRect( 0, 0, width, height );
	context1.fillStyle="rgb(230,0,0)";
	for( i = 0; i < loop; i++ ) {
    	context1.beginPath();
    	context1.arc(inv_cdr( Accuracy, Math.random() )*width, i * height/loop, pointSize, 0, Math.PI * 2, true);
    	context1.fill();
    }
}

function drawPolarCoordsFunction( Accuracy, loop ) {
	context1.clearRect( 0, 0, width, height );
	context1.beginPath();
	context1.arc(width/2, height/2, width<height?width/2:height/2, 0, Math.PI * 2, true);
    context1.stroke();
    context1.fillStyle="rgb(200,0,0)";
	for( i = 0; i < loop; i++ ) {
    	context1.beginPath();
    	r = inv_cdr_polar( Accuracy, Math.random() )*height/2;
    	theta = Math.random() * 2 * Math.PI;
    	x = r * Math.cos(theta);
    	y = r * Math.sin(theta);
    	context1.arc(x+width/2, y+height/2, pointSize, 0, Math.PI * 2, true);
    	context1.fill();
    }
}

function initHTML5Renderer() {
    canvas1 = document.getElementById("canvas1");
    context1 = canvas1.getContext("2d");
    width = canvas1.width;
    height = canvas1.height;
    
    prop = new function() { this.Accuracy=0.7; this.FunctionType=0; this.UserDefinedFunction=false; }
    var gui = new dat.GUI( {autoPlace: false} );
    var customContainer = document.getElementById('controller');
	customContainer.appendChild(gui.domElement);

	gui.add(prop, 'Accuracy', 0.0, 1.0).onChange(function(value) {
	 	refresh(null);
		});
	gui.add(prop, 'FunctionType', { Linear: 0, Polar: 1 } ).onChange(function(value) {
	 	refresh(value);
		});
	refresh(0);
}

function refresh(type) {
	if( old_accuracy == prop.Accuracy && type==null )
		return;
	old_accuracy = prop.Accuracy;
	if( type == null ) type = old_type;
	else old_type = type;
	if( type == 0 )
		drawLinearFunction( prop.Accuracy, 1000 );
	else if( type == 1)
		drawPolarCoordsFunction( prop.Accuracy, 1000 );
}
initHTML5Renderer();