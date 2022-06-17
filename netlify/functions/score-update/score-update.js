

// Grab our credentials from a .env file or environment variables
require('dotenv').config();
const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;

// Connect to our database
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// Our standard serverless handler function
exports.handler = async event => {

    const { data, error } = await supabase.from("scoreboard").upsert(
        {
            student_name: event.queryStringParameters.name,
            score: event.queryStringParameters.score,
            group_id: "1"
        },{
            onConflict: 'student_name'
        }
    );

    // Did it work?
    console.log(data, error);
    return {
        statusCode: 200,
        data: data
        ,
        error: error
    };
}
