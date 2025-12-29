import { ApiResponse } from "@/types/types";
// import apiHandler from "../actions/baseHandler";
import baseHandler from "../actions/baseHandler";


const AddProducts = async (
  productRequest: FormData,
  showLoader?: () => void,
  hideLoader?: () => void
): Promise<ApiResponse> => {
  console.log(productRequest)
  productRequest.append("apiname", "products/addproducts");

  return await baseHandler(
    "POST",
    productRequest,
    "",
    showLoader,
    hideLoader
  );
};


  const GetProducts = async (
    productRequest:any,
    showLoader?: () => void,
    hideLoader?: () => void,
    //cryptoConfig?: any
  ): Promise<ApiResponse> => {
    const payload = productRequest
    return await baseHandler(
      "POST",
      payload,
      "",
      showLoader,
      hideLoader,
      //cryptoConfig
    );
  };

  export { AddProducts };