const TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function validateToken( req, res, next ){
    let token = req.headers.authorization;
    //let token2 = req.query.apikey;
    //let token3 = req.headers['book-api-key'];
    //console.log( "The header book-api-key:" );
    //console.log( req.headers['book-api-key'] );

    if( !token ){
        token = req.query.apikey; 
    }

    if( !token ){
        token = req.headers['book-api-key'];
    }
    

    if( !token ){
        res.statusMessage = "You need to send the 'authorization' token.";
        return res.status( 401 ).end();
    }

    if( token !== `Bearer ${TOKEN}` && token !==`${TOKEN}` ){
        res.statusMessage = "The 'authorization' TOKEN is invalid.";
        return res.status( 401 ).end();
    }

    next();

}

module.exports = validateToken;