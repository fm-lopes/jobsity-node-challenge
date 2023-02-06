import axios from 'axios';
import { sequelize } from '../models/index.model';
import Quote from '../models/quote.model';

interface IStockResponse {
    name: string,
    symbol: string,
    open: number,
    high: number,
    low: number,
    close: number
}

class StockService {

    public async getQuote(stockCode: string, userId: number): Promise<IStockResponse> {
        const quote = await this.getStockQuote(stockCode);

        return Quote.create({
            ...quote,
            userId
        });
    }

    public getUserQuotes(userId: number): Promise<Quote[]> {
        return Quote.findAll({ where: { userId }});
    }

    public getQuoteStats(limit?: 5): Promise<any> {
        return Quote.findAll({
            attributes: [['symbol', 'stock'], [sequelize.fn('COUNT', 'id'), 'times_requested']],
            group: ['symbol'],
            limit
        });
    }

    private async getStockQuote(stockCode: string): Promise<IStockResponse> {
        const serviceURL = process.env.STOCK_SERVICE || 'localhost';
        const response = await axios.get(`http://${serviceURL}:3002/stock?stockCode=${stockCode}`);

        return response.data.quote;
    }
}

export const stockService = new StockService();