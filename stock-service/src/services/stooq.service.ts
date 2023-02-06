import axios from 'axios';

interface IStockResponse {
    name: string,
    symbol: string,
    open: number,
    high: number,
    low: number,
    close: number
}

interface IStooqBody {
    Symbol?: string;
    Date?: string;
    Time?: string;
    Open?: number;
    High?: number;
    Low?: number;
    Close?: number;
    Volume?: number;
    Name?: string;
}

class StooqService {

    public async getQuote(stockCode: string): Promise<IStockResponse> {
        const response = await axios.get(`https://stooq.com/q/l?s=${stockCode}&f=sd2t2ohlcvn&h&e=csv`);
        const quote = this.parseStooqResponse(response.data);

        const parsedQuote:IStockResponse = {
            name: quote.Name,
            symbol: quote.Symbol,
            open: Number(quote.Open),
            high: Number(quote.High),
            low: Number(quote.Low),
            close: Number(quote.Close)
        }

        return parsedQuote;
    }

    private parseStooqResponse(raw: string) {

        const [allColumns, allValues] = raw.split('\r\n');
        const columns = allColumns.split(',');
        const values = allValues.split(',');

        const parsed: any = {};

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column) {
                parsed[column] = values[i];
            }
        }

        return parsed as IStooqBody;
    }
}

export const stooqService = new StooqService();