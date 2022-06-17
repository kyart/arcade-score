

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

    const data = await supabase.from("scoreboard").upsert(
        {
            student_name: this.inputName,
            score: this.inputScore,
            group_id: "1"
        },{
            onConflict: 'student_name'
        }
    );

    // Did it work?
    console.log(data);
    return {
        statusCode: 200,
        data: data
    };
}
