import { IDTO } from "../interfaces/DTO";

class CreateBillingInformationDTO implements IDTO {

    public address: string;
    
    public zipCode: number;
    
    public city: string;

    public country: string;
}

export default CreateBillingInformationDTO;