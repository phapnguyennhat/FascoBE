import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CreateMomoDto } from './dto/createMomo.dto';
import axios from 'axios';
import { ERequestTypeMoMo } from 'src/common/enum/ERequestTypeMoMo';
import { ConfirmMomoDto } from './dto/confirmMomo.dto';
import { QueryMomoDto } from './dto/queryMomo.dto';


@Injectable()
export class MomoService {
    accessKey: string;
    secretKey: string;
    orderInfo: string;
    partnerCode: string;
    partnerName: string;
    lang: string;
    host: string;
    storeId: string;
    redirectUrl: string;
    ipnUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.accessKey = configService.get('MOMO_ACCESSKEY');
        this.secretKey = configService.get('MOMO_SECRETKEY');
        this.orderInfo = configService.get('MOMO_ORDERINFO');
        this.partnerCode = configService.get('MOMO_PARTNERCODE');
        this.partnerName = configService.get('MOMO_PARTNERNAME');
        this.lang = configService.get('MOMO_LANG');
        this.host = configService.get('MOMO_HOST');
        this.storeId = configService.get('MOMO_STOREID');
        this.redirectUrl = configService.get('MOMO_REDIRECT_URL');
        this.ipnUrl = configService.get('MOMO_IPN_URL');
    }

    genSignCreate(config: CreateMomoDto) {
        const {
            orderInfo,
            partnerCode,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            requestId,
            amount,
            orderId,
        } = config;
        const rawSignature =
            'accessKey=' +
            this.accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        return signature;
    }


    async createMomo(userId: string, amount: number, orderId: string) {
        const jsonString = JSON.stringify({ userId });
        const requestId = this.partnerCode + new Date().getTime();
        const config: CreateMomoDto = {
            partnerCode: this.partnerCode,
            partnerName: this.partnerName,
            storeId: this.storeId,
            requestId,
            amount,
            orderId,
            orderInfo: this.orderInfo,
            autoCapture: true,
            redirectUrl: this.redirectUrl,
            ipnUrl: this.ipnUrl, //chú ý: cần dùng ngrok thì momo mới post đến url này được
            requestType: ERequestTypeMoMo.PAYWITHMETHOD,
            extraData: Buffer.from(jsonString).toString('base64'),
            lang: this.lang,
        };

        const sign = this.genSignCreate(config);

        const requestBody = JSON.stringify({
            ...config,
            signature: sign,
        });
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };
        const result = await axios(options);
        return result.data;
    }

    async actionPayment(amount: number, orderId: string, requestType: ERequestTypeMoMo) {
        const requestId = this.partnerCode + new Date().getTime();
        const config: ConfirmMomoDto = {
            partnerCode: this.partnerCode,
            requestId,
            orderId,
            requestType,
            lang: this.lang,
            amount,
            description: 'confirm transaction',
        };

        const signConfirm = this.genSignAction(config);
        const requestBody = JSON.stringify({
            ...config,
            signature: signConfirm,
        });
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/confirm',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        const result = await axios(options);
        return result.data;
    }

    genSignAction(config: ConfirmMomoDto) {
        const {
            amount,
            description,
            orderId,
            partnerCode,
            requestId,
            requestType,
        } = config;

        const rawSignature =
            'accessKey=' +
            this.accessKey +
            '&amount=' +
            amount +
            '&description=' +
            description +
            '&orderId=' +
            orderId +
            '&partnerCode=' +
            partnerCode +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        return signature;
    }

    signQuery(config: QueryMomoDto) {
        const { orderId, partnerCode, requestId } = config;
        const rawSignature =
            'accessKey=' +
            this.accessKey +
            '&orderId=' +
            orderId +
            '&partnerCode=' +
            partnerCode +
            '&requestId=' +
            requestId;

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        return signature;
    }

    async queryMomo(orderId: string) {
        const requestId = this.partnerCode + new Date().getTime();
        const config: QueryMomoDto = {
            partnerCode: this.partnerCode,
            requestId,
            orderId,
            lang: this.lang,
        };
        const signQuery = this.signQuery(config);
        const requestBody = JSON.stringify({
            ...config,
            signature: signQuery,
        });

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        const result = await axios(options);
        return result.data;
    }


}
