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

    // 認証情報をチェックする
    if (event.headers.Authorization !== "dwc2019"){
        response.statusCode = 400;
        response.body = JSON.stringify({"message":"ログインしてください。"});
        callback(null, response);
        return;
    }

    var body = JSON.parse(event.body);

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

    // dynamo.put()でDBのデータを更新
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