var AWS = require("aws-sdk");
var dynamo = new AWS.DynamoDB.DocumentClient();
var tableName = "user";

exports.handler = (event, context, callback) => {
    var response = {
        statusCode: 200,
        headers : {
                "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify({"message" : "" })
    };

    // リクエストを取得し、JSのオブジェクトにパースする
    var body = JSON.parse(event.body);

    // (バリデーション)bodyが空だったら返す
    if(!body){
        response.statusCode = 400;
        response.body = JSON.stringify({"message":"bodyが空です。"});
        callback(null, response);
        return;
    }

    // bodyの中身を取得
    var userId = body.userId;
    var age = body.age;
    var password = body.password;
    var nickname = body.nickname;

    // (バリデーション)パラメータのどれかが空だったら返す
    if(!userId || !password || !nickname || !age){
        response.statusCode = 400;
        response.body = JSON.stringify({"message":"パラメータが足りません。"});
        callback(null, response);
        return;
    }

    // DBに登録するための情報をparamオフジェクトとして宣言する
    var param = {
        "TableName": tableName,
        "Item": {
            "userId": body.userId,
            "password": body.password,
            "age": body.age,
            "nickname": body.nickname
        }
    };

    // dynamo.put()でDBにデータを登録
    dynamo.put(param, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "DynamoDB Error",
                "detail": err
            });
            callback(null, response);
            return;
        } else {
            // 登録に成功した場合の処理
            response.body = JSON.stringify(param.Item);
            callback(null, response);
            return;
        }
    });

};