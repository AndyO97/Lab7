const mongoose = require( 'mongoose' );
mongoose.set('useFindAndModify', false);


const bookmarksSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : 'String'
        //required : true,
    },
    url : {
        type : String,
        required : true,
    },
    rating : {
        type : Number
        //required : true,
    }
});

const bookmarksCollection = mongoose.model( 'bookmarks', bookmarksSchema );

const Bookmarks = {
    createBookmark : function( newBookmark ){
        return bookmarksCollection
            .create( newBookmark )
            .then( createdBookmark => {
                return createdBookmark;
            })
            .catch( err => {
                return err;
            });
    },
    getAllBookmarks : function(){
        return bookmarksCollection
            .find()
            .then( allBookmarks => {
                return allBookmarks;
            })
            .catch( err => {
                return err;
            });
    },
    getBookmarks : function(Ptitle){
        return bookmarksCollection
            .find({title: Ptitle})
            .then( allBookmarks => {
                return allBookmarks;
            })
            .catch( err => {
                return err;
            });
    },
    deleteBookmark : function(Pid){
        return bookmarksCollection
            //.deleteOne({id: Pid})
            .findOneAndRemove({id: Pid})
            .then( allBookmarks => {
                return allBookmarks;
            })
            .catch( err => {
                return err;
            });
    },
    updateBookmark : function(Pid){
        return bookmarksCollection
            //.findOneAndUpdate({id: Pid}, {$set : update}, {returnnewDocument : true}) //{returnOriginal:false} //{new: true}
            .findOne({id: Pid})
            .then( allBookmarks => {
                return allBookmarks;
            })
            .catch( err => {
                return err;
            });
    }
}

module.exports = { Bookmarks };