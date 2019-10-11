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

    var userId = event.queryStringParameters.userId;

    // 取得対象のテーブル名と検索に使うキーをparamに宣言
    var param = {
        "TableName": tableName,
        "Key": {
            "userId": userId
        }
    };

    // dynamo.get()でDBからデータを取得
    dynamo.get(param, function(err, data) {
        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify({
                "message": "DynamoDB Error",
                "detail": err
            });
            callback(null, response);
            return;
        }

        // 条件に該当するデータがあればパスワードを隠蔽する
        if (data.Item){
            delete data.Item.password;
        }

        // レスポンスボディの設定とコールバックを記述
        response.body = JSON.stringify(data.Item);
        callback(null, response);
    });

};