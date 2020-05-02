const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( 'mongoose' );
const validateToken = require('./middleware/validateToken.js');
const { Bookmarks } = require( './models/bookmarkModel' );
const app = express();
const jsonParser = bodyParser.json();
const { v4: uuidv4 } = require('uuid');


app.use( morgan( 'dev' ) );
app.use( validateToken );

let listOfBookmarks = [];


app.get( '/api/bookmarks', ( req, res ) => {
    console.log( "Getting all bookmarks." );
    
    Bookmarks
        .getAllBookmarks()
            .then( result => {
                return res.status( 200 ).json( result );
            })
            .catch( err => {
                res.statusMessage = "Something is wrong with the Database. Try again later";
                return res.status( 500 ).end();
            });

});



app.get( '/api/bookmark', ( req, res ) => {
    console.log( "Getting a bookmark by the title value using the query string." );
    console.log( req.query );
    let title = req.query.title; 

    if( !title ){
        res.statusMessage = "Please send the 'title' as parameter.";
        return res.status( 406 ).end();
    }

    Bookmarks
        .getBookmarks(title)
            .then( result => {
                 // Handle not found title error
                // if( result.errmsg ){
                if(!result.length){
                    res.statusMessage = `There are no bookmarks with the provided 'title=${title}'.`+
                                        result.errmsg;
                    return res.status( 404 ).end();
                }
                return res.status( 200 ).json( result );
            })
            .catch( err => {
                res.statusMessage = "Something is wrong with the Database. Try again later";
                return res.status( 500 ).end();
            });

});


app.post( '/api/bookmarks', jsonParser, ( req, res ) => {
    console.log( "Adding a new bookmark to the list." );
    console.log( "Body ", req.body );
    
    let id = uuidv4();
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;


    if( !title || !description || !url || !rating ){
        res.statusMessage = "One of these parameters is missing in the request: 'title', 'description', 'url' or 'rating'.";
        return res.status( 406 ).end();
    }

    if( typeof(rating) !== 'number' ){
        res.statusMessage = "The 'rating' MUST be a number.";
        return res.status( 409 ).end();
    }
    
        let newBookmark = { id, title, description, url, rating };

        Bookmarks
            .createBookmark( newBookmark)
            .then( result => {
                // Handle id duplicate error
                if( result.errmsg ){
                    res.statusMessage = "The 'Title' is already on the Bookmark list."+
                                        result.errmsg;
                    return res.status( 409 ).end();
                }
                return res.status( 201 ).json( result ); 
            })
            .catch( err => {
                res.statusMessage = "Something is wrong with the Database. Try again later";
                return res.status( 500 ).end();
            });
});

app.delete( '/api/bookmark/:id', ( req, res ) => {
    console.log( "Deleting a bookmark by id using the integrated param." ); 
    let id = req.params.id;
    console.log(id);

    if( !id ){
        res.statusMessage = "Please send the 'id' to delete a bookmark";
        return res.status( 406 ).end();
    }

    Bookmarks
            .deleteBookmark( id )
            .then( result => {
                // Handle id no id found error
                console.log(result);
                if( !result ){
                    console.log(result);
                    res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`+
                                        result.errmsg;
                    return res.status( 409 ).end();
                }
                return res.status( 200 ).end(); 
            })
            .catch( err => {
                res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`;
                return res.status( 404 ).end();
                //res.statusMessage = "Something is wrong with the Database. Try again later";
                //return res.status( 500 ).end();
            });
});


app.patch( '/api/bookmark/:id', jsonParser, ( req, res ) => {
    console.log( "Patching a bookmark by id using the integrated param." );
    console.log( req.params ); 
    console.log( "Body ", req.body );

    let id = req.params.id;
    let id2 = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if( !id2 ){
        res.statusMessage = `There is no id on the body of the request.`;
        return res.status( 406 ).end();
    }

    if( id != id2 ){
        res.statusMessage = `The id passed in the parameters and the id in the body don't match.`;
        return res.status( 409 ).end();
    }
    /*
    let update = "{";
            if(title){
                update +=`title: "${title}"`;
            }
            if(description){
                if(update != "{"){
                    update +=`,`;
                }
                update +=`description: "${description}"`;
            }
            if(url){
                if(update != "{"){
                    update +=`,`;
                }
                update +=`url: "${url}"`;
            }
            if(rating){
                if(update != "{"){
                    update +=`,`;
                }
                update +=`rating: ${rating}`;
            }
            update += "}";
            console.log("This is the update content:");
            console.log(update);
            */
            Bookmarks
            .updateBookmark( id )
            .then( result => {
                console.log("Value of result");
                console.log(result);
                // Handle id duplicate error
                if( !result){
                    res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`+
                                        result.errmsg;
                    return res.status( 404 ).end();
                }
                //return res.status( 200 ).end(); 
                //let newBookmark = { id, title, description, url, rating };
                if(title){
                    result.title = title;
                }
                if(description){
                    result.description = description;
                }
                if(url){
                    result.url = url;
                }
                if(rating){
                    result.rating = rating;
                }
                result.save(); 
                    //if (err) return handleError(err);
                    //res.send(result);
                return res.status( 202 ).json( result ); 
            })
            .catch( err => {
                res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`;
                return res.status( 404 ).end();
                //res.statusMessage = "Something is wrong with the Database. Try again later";
                //return res.status( 500 ).end();
            })
});

app.listen( 8080, () => {
    console.log( "This server is running on port 8080" );

    new Promise(( resolve, reject ) => {
        const settings = {
            useNewUrlParser: true,  //This and Topology will make sure the url is parsed
            useUnifiedTopology: true,
            useCreateIndex: true //So mongo will recognize there is a field it will treat as a unique one
        };
        mongoose.connect( 'mongodb://localhost/bookmarksdb', settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected succesfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    })
});


// Base URL : http://localhost:8080/
// GET endpoint : http://localhost:8080/api/bookmarks
// GET by title in query : http://localhost:8080/api/bookmark?title=YouTube

/* POST  use:
http://localhost:8080/api/bookmarks

{
	"title" : "facebook",
	"description" : "Social media webpage",
	"url" : "www.facebbok.com",
	"rating" : 9
}

{
	"title" : "YouTube",
	"description" : "Video Streaming",
	"url" : "www.youtube.com",
	"rating" : 8
}

{
	"title" : "Vimeo webpage",
	"description" : "Video Streaming on Vimeo webpage",
	"url" : "www.vimeo.com.us",
	"rating" : 10
}
*/

//DELETE by id in param : http://localhost:8080/api/bookmark/123

/* PATCH  use:
http://localhost:8080/api/bookmark/123

{
	"id" : "5eace8f5b3314000d0f2e171",
	"title" : "YouTube",
	"description" : "Video Streaming",
	"url" : "www.youtube.com",
	"rating" : 8
}

{
	"id" : "1a0894d8-a6e8-4270-b020-7463b0b711ea",
	"title" : "Vimeo webpage",
	"description" : "Video Streaming on Vimeo webpage",
	"url" : "www.vimeo.com.us",
	"rating" : 10
}
*/