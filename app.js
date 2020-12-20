const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const  mongoose  = require("mongoose");
const Cors = require("cors");
const port = process.env.PORT || 5000;  


const app = express();


// middleware ///
app.use(express.json());
app.use(Cors());


app.set('view engine', 'ejs' );

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/apiDB", 
{
    
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// /////////// request Targeting  All Article

app.route("/articles") 

    .get((req,res) => {
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            }else{
                res.send(err);
            }
        });   

    })
    .post((req,res) => {
        
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save( function(err){
            if(!err){
                res.send("New Article is uploaded Successfully");
            }else{
                res.send(err);
            }
        });

    })
    .delete(function(req,res){
        Article.deleteMany( function(err){
            if(!err){
                res.send("Successfully deleted all Articles");
            }else{
                res.send(err);
            }
        });
    });

// ////////////////////// Request Targeting  All Article
app.route("/articles/:articleTitle")

  .get( function(req,res){

        console.log (req.params.articleTitle);

        Article.findOne({title: req.params.articleTitle}, function(err , foundArticle){
             if(foundArticle){
                 res.send(foundArticle);
             }else{
                 res.send("No articles matching that title was found ");
             }
        });
        
    })
   
    .put( function(req,res){
         Article.update(
             {title : req.params.articleTitle},
             {
                title: req.body.title,
                content: req.body.content
             },
             {overwrite: true},
             function(err){
                 if(!err){
                     res.send("successfully data updated");
                 }else{
                     res.send(err);
                 }
             }
         );
    })
    .patch( function(req,res){
           Article.update(
               { title: req.params.articleTitle },
               { $set: req.body},
               function(err){
                   if(!err){
                       res.send("Succesfully updated the article.");
                   }else{
                       res.send(err)
                   }
               }
           );        
    })

    .delete( function(req,res){
          
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the corresponding Article");
                }else{
                    res.send(err);
                }
            }
        );
    });

app.listen(port, function(){
    console.log(`Server started on port ${port}`)
});