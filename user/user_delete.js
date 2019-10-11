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

    var body = JSON.parse(event.body);
    var userId = body.userId;

    // 削除対象のテーブル名と削除したいデータのkeyをparamに設定
    var param = {
        "TableName": tableName,
        "Key": {
            "userId": userId
        }
    };

    // dynamo.delete()を用いてデータを削除
    dynamo.delete(param, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "DynamoDB Error",
                "detail": err
            });
            callback(null, response);
            return;
        }else{
            // 削除に成功した場合の処理
            response.body = JSON.stringify({});
            callback(null, response);
        }
    });

};