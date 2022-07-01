

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
    const params = JSON.parse(event.body)
    const names = params.names
    const groupId = params.group_id
    const game = params.game
    const gameId = params.game_id
    const sessionId = params.session_id

    console.dir(event)
    for (const name of names) {
        const { data, error } = await supabase.from("scoreboard").insert(
            {
                student_name: name,
                score: 0,
                group_id: groupId,
                game_name: game,
                game_id: gameId,
                session_id: sessionId
            }
        )
        // Did it work?
        console.log(data, error);

    }
    return {
        statusCode: 200,
    };
}
