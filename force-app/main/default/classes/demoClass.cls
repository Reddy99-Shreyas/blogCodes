public class demoClass {
    //printing the number which are prime till given limit
    public static void prime(integer num){
        for(integer i=2;i<=num;i++){
            //system.debug('i: '+i);
            boolean isPrime = true;
            for(integer j=2;j<=i/2;j++){
                //system.debug('j: '+j);
                if(math.mod(i,j)==0){
                    isPrime = false;
                    break;
                }
            }
            if(isPrime){
                system.debug(i);
            }
        }
    }
    
    //check that number is prime
    public static void checkPrime(Integer num){
        boolean prime = true;
        for(integer i=2; i<=num/2; i++){
            if(math.mod(num,i)==0){
                prime = false;
                break;
            }
        }
        system.debug(prime);
    }
    
    //Reverse String
    public static String revString(String input){
        String reversed = '';
        system.debug(input.length());
        //index starts from zero
        for(Integer i=input.length()-1;i>=0;i--){
            reversed += input.substring(i,i+1);
        }
        return reversed;
    }
}