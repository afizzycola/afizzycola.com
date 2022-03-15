import axios from 'axios';
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: `${__dirname}/../.env` });


const prodAPI = axios.create({
    baseURL: `${process.env.AWSAPIDOMAIN}`,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'x-api-key': process.env.AWSPRODAPIKEY
    }
})

const confirmedItemsResponse = await prodAPI.get('/line-items/status/confirmed')
const confirmedItems = confirmedItemsResponse.data.Items



