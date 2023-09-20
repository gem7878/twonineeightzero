import client from "../config/db.config.js";

export async function confirmUserName(user_name) {
    try {
        const query = `SELECT * FROM user_account WHERE user_name=$1`;
        const values = [user_name,]
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export async function createUserAccount(user_name, hashedPassword) {
    try {
        const query = `INSERT INTO user_account(user_name, password_hash) VALUES($1, $2) RETURNING user_id`;
        const values = [user_name,hashedPassword];
        const user_id = await client.query(query, values);
        return user_id;
    } catch (error) {
        throw error;
    }
}