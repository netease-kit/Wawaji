namespace NIM.NimException
{
    public class SdkUninitializedException : System.Exception
    {
        public SdkUninitializedException()
            :base("Please call the ClientAPI.Init function first and make sure it return true")
        {
            
        }
    }

    public class VersionUnmatchedException : System.Exception
    {
        public VersionUnmatchedException(string component,string requiredVer)
            :base("Version not matched:"+component+",required version:"+requiredVer)
        {
            
        }
    }
}
