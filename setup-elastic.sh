curl -XDELETE localhost:9200/client_content
echo $' '

curl -XPUT localhost:9200/client_content
echo $' '

curl -XPUT localhost:9200/client_content/BlogPost/_mapping -d ' {
    "BlogPost": {
        "properties":{
            "navigationOrder":{
                "type":"integer",
                "index":"not_analyzed"
            },
            "navigationAnchor":{
                "type":"string",
                "index":"not_analyzed"
            },
            "contentAlias":{
                "type":"string",
                "index":"not_analyzed"
            }
        }
    }
} '
echo $' '

curl -XPUT localhost:9200/client_content/InTheNews/_mapping -d ' {
    "BlogPost": {
        "properties":{
            "navigationOrder":{
                "type":"integer",
                "index":"not_analyzed"
            },
            "navigationAnchor":{
                "type":"string",
                "index":"not_analyzed"
            },
            "contentAlias":{
                "type":"string",
                "index":"not_analyzed"
            }
        }
    }
} '
echo $' '

curl -XPUT localhost:9200/client_content/MagazineArticle/_mapping -d ' {
    "BlogPost": {
        "properties":{
            "navigationOrder":{
                "type":"integer",
                "index":"not_analyzed"
            },
            "navigationAnchor":{
                "type":"string",
                "index":"not_analyzed"
            },
            "contentAlias":{
                "type":"string",
                "index":"not_analyzed"
            }
        }
    }
} '
echo $' '

curl -XPUT localhost:9200/client_content/NewsletterPost/_mapping -d ' {
    "BlogPost": {
        "properties":{
            "navigationOrder":{
                "type":"integer",
                "index":"not_analyzed"
            },
            "navigationAnchor":{
                "type":"string",
                "index":"not_analyzed"
            },
            "contentAlias":{
                "type":"string",
                "index":"not_analyzed"
            }
        }
    }
} '
echo $' '

curl -XPUT localhost:9200/client_content/BasicPage/_mapping -d ' {
    "BasicPage": {
        "properties":{
            "navigationOrder":{
                "type":"integer",
                "index":"not_analyzed"
            },
            "navigationAnchor":{
                "type":"string",
                "index":"not_analyzed"
            },
            "contentAlias":{
                "type":"string",
                "index":"not_analyzed"
            }
        }
    }
} '
echo $' '