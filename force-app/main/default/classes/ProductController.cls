public with sharing class ProductController {
    public ProductController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductList() {
        return [
            SELECT Id, Name
            FROM Product2            
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> findProducts(String searchKey){
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, ProductCode, Family, Description
            FROM Product2         
            WHERE Name like :key OR ProductCode like :key
            WITH SECURITY_ENFORCED            
            ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> getPriceBookEntryList(String productId) {
        return [            
            SELECT Id, Product2.Name, PriceBook2.Name, UnitPrice
            FROM PriceBookEntry
            WHERE Product2Id =:productId
            WITH SECURITY_ENFORCED
            ORDER BY UnitPrice
        ];
    }
}
    
