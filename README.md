<h1>This app serves to manage bookmarks and their information with Mongoose</h1>
<p>Once you clone this repository don't forget to run npm install previous to npm start </p>


<p>Base URL : http://localhost:8080/ </p>
<p>GET endpoint : http://localhost:8080/api/bookmarks </p>
<p>GET by id in query : http://localhost:8080/api/bookmark?title=YouTube </p>
<p>POST  use:
http://localhost:8080/api/bookmarks

{
	"title" : "facebook",
	"description" : "Social media webpage",
	"url" : "www.facebbok.com",
	"rating" : 9
} </p>
<p>DELETE by id in param : http://localhost:8080/api/bookmark/123 </p>

<p>PATCH  use:
http://localhost:8080/api/bookmarks/123

{
    "id" : "123"
	"title" : "Web class",
	"description" : "Learning on web apps",
	"rating" : 11
} </p>