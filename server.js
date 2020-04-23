const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const validateToken = require('./middleware/validateToken.js');
const app = express();
const jsonParser = bodyParser.json();
const { v4: uuidv4 } = require('uuid');


app.use( morgan( 'dev' ) );
app.use( validateToken );

let listOfBookmarks = [
    {       
        id: "b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        title: "YouTube",
        description: "Page to see videos",
        url: "https://www.youtube.com",
        rating: 8
        //name : "Marcel",
        //id : 123
    },
    {   
        id: "b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e",
        title: "Mis Cursos",
        description: "Page to see university content",
        url: "https://miscursos.tec.mx/",
        rating: 9
        //name : "Martha",
        //id : 456
    },
    {
        id: "123",
        title: "Web Applications Development",
        description: "Page to see the content of the course Web Application development",
        url: "https://sites.google.com/site/wadfeb3/",
        rating: 10
        //name: "Alfredo",
        //id : 847
    }
];


app.get( '/api/bookmarks', ( req, res ) => {
    console.log( "Getting all bookmarks." );
    console.log( req.headers );
    console.log( req.params );

    return res.status( 200 ).json( listOfBookmarks );
});



app.get( '/api/bookmark', ( req, res ) => {
    console.log( "Getting a bookmark by the title value using the query string." );
    console.log( req.query );
    let title = req.query.title; 

    if( !title ){
        res.statusMessage = "Please send the 'title' as parameter.";
        return res.status( 406 ).end();
    }

    let result = listOfBookmarks.find( ( bookmark ) => {
        if( bookmark.title == title  ){
            return bookmark;
        }
    });

    if( !result ){
        res.statusMessage = `There are no bookmarks with the provided 'title=${title}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( result ); 
});

app.get( '/api/getBookmark', ( req, res ) => {
    console.log( "Getting a bookmark by id using the query string." );
    console.log( req.query );
    
    let id = req.query.id; 

    if( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status( 406 ).end();
    }

    let result = listOfBookmarks.find( ( bookmark ) => {
        if( bookmark.id == id ){
            return bookmark;
        }
    });

    if( !result ){
        res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( result ); 
});

app.get( '/api/getBookmark/:id', ( req, res ) => {
    console.log( "Getting a bookmark by id using the integrated param." );
    console.log( req.headers );
    //console.log( req.params ); 
    //console.log( req.params.apikey );
    //console.log( req.headers.book-api-key );
    let id = req.params.id;

    let result = listOfBookmarks.find( ( bookmark ) => {
        if( bookmark.id == id  ){
            return bookmark;
        }
    });

    if( !result ){
        res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( result ); 
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
    
    let flag = true;

    for( let i = 0; i < listOfBookmarks.length; i ++ ){
        if( listOfBookmarks[i].title == title  ){
            flag = !flag;
            break;
        }
    }

    if( flag ){
        let newBookmark = { id, title, description, url, rating };
        listOfBookmarks.push( newBookmark );

        return res.status( 201 ).json( newBookmark ); 
    }
    else{
        res.statusMessage = "The 'Title' is already on the Bookmark list.";
        return res.status( 409 ).end();
    }
});

app.delete( '/api/bookmark/:id', ( req, res ) => {
    console.log( "Getting a bookmark by id using the integrated param." );
    console.log( req.headers );
    
    let id = req.params.id;

    if( !id ){
        res.statusMessage = "Please send the 'id' to delete a bookmark";
        return res.status( 406 ).end();
    }

    let itemToRemove = listOfBookmarks.findIndex( ( bookmark ) => {
        if( bookmark.id == id ){
            return true;
        }
    });

    if( itemToRemove < 0 ){
        res.statusMessage = "That 'id' was not found in the list of bookmarks.";
        return res.status( 404 ).end();
    }

    listOfBookmarks.splice( itemToRemove, 1 );
    return res.status( 200 ).end();
});


//app.post( '/api/bookmarks', jsonParser, ( req, res ) => {
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
    
    let result = listOfBookmarks.find( ( bookmark ) => {
        if( bookmark.id == id  ){
            if(title){
                bookmark.title = title;
            }
            if(description){
                bookmark.description = description;
            }
            if(url){
                bookmark.url = url;
            }
            if(rating){
                bookmark.rating = rating;
            }
            let newBookmark = { id, title, description, url, rating };
            return newBookmark;
        }
    });

    if( !result ){
        res.statusMessage = `There are no bookmarks with the provided 'id=${id}'.`;
        return res.status( 404 ).end();
    }



    return res.status( 202 ).json( result ); 
});

app.listen( 8080, () => {
    console.log( "This server is running on port 8080" );
});


// Base URL : http://localhost:8080/
// GET endpoint : http://localhost:8080/api/bookmarks
// GET by id in query : http://localhost:8080/api/getBookmark?id=b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e
// GET by id in param : http://localhost:8080/api/getBookmark/b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e
// GET by title in query : http://localhost:8080/api/bookmark?title=YouTube

/* POST  use:
http://localhost:8080/api/bookmarks

{
	"title" : "facebook",
	"description" : "Social media webpage",
	"url" : "www.facebbok.com",
	"rating" : 9
}
*/

//DELETE by id in param : http://localhost:8080/api/bookmark/123

/* PATCH  use:
http://localhost:8080/api/bookmarks/123

{
    "id" : "123"
	"title" : "Web class",
	"description" : "Learning on web apps",
	"rating" : 11
}
*/