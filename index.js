var through = require( "through" );
var sass = require( "node-sass" );
var path = require( "path" );

module.exports = function( file, opts ) {
	var data = "";
	if( file !== undefined && path.extname( file ) !== ".scss" )
		return through();
	else
		return through( write, end );

	function write(buf) {
		data += buf;
	}

	function end() {
		try {
			opts = opts ? opts : {};
			var includePaths = opts.includePaths;
			var pathToAdd = [path.dirname(file)];
			opts.includePaths = Array.isArray(includePaths) ?
			                    includePaths.concat(pathToAdd) :
			                    pathToAdd;
			this.queue( sass.renderSync( data, opts ) );
		} catch( err ) {
			this.emit( 'error', new Error( err ) );
		}

		this.queue( null );
	}
};
