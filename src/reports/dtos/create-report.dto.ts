import {
    IsNumber,
    IsString,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
    
} from 'class-validator';
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
export class CreateReportDto {

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(currentYear)
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;
}