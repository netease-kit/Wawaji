using System;
using System.Linq;
using System.Runtime.InteropServices;

namespace NimUtility
{
    public static class DelegateConverter
    {
        const int DefaultDelegateSize = 64;

        public static IntPtr ConvertToIntPtr(Delegate d)
        {
            if (d != null)
            {
                IntPtr ptr = AllocMem(DefaultDelegateSize);
                Marshal.GetNativeVariantForObject(d, ptr);
                return ptr;
            }
            return IntPtr.Zero;
        }

        public static TDelegaet ConvertFromIntPtr<TDelegaet>(IntPtr ptr)
        {
            if (ptr == IntPtr.Zero)
                return default(TDelegaet);
            var x = (TDelegaet)Marshal.GetObjectForNativeVariant(ptr);
            return x;
        }

        public static void Invoke<TDelegate>(this IntPtr ptr,params object[] args)
        {
            var d = ConvertFromIntPtr<TDelegate>(ptr);
            var delegateObj = d as Delegate;
            if (delegateObj != null)
            {
                System.Diagnostics.Debug.Assert(CheckDelegateParams(delegateObj, args));
                try
                {
                    delegateObj.Method.Invoke(delegateObj.Target, args);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                }
                finally
                {
                   // FreeMem(ptr);
                }
            }
        }

        public static void InvokeOnce<TDelegate>(this IntPtr ptr, params object[] args)
        {
            var d = ConvertFromIntPtr<TDelegate>(ptr);
            var delegateObj = d as Delegate;
            if (delegateObj != null)
            {
                System.Diagnostics.Debug.Assert(CheckDelegateParams(delegateObj, args));
                try
                {
                    delegateObj.Method.Invoke(delegateObj.Target, args);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                }
                finally
                {
                    FreeMem(ptr);
                }
            }
        }

        static IntPtr AllocMem(int bytes)
        {
            try
            {
                return Marshal.AllocCoTaskMem(bytes);
            }
            catch (OutOfMemoryException)
            {
                return IntPtr.Zero;
            }
        }

        static bool CheckDelegateParams(Delegate d,params object[] args)
        {
            var ps = d.Method.GetParameters();
            if (args == null && ps.Any())
                return false;
            if (args != null && args.Count() != ps.Count())
                return false;
            for (int i = 0; i < args.Count(); i++)
            {
                if (args[i] == null)
                    continue;
                if (!ps[i].ParameterType.IsInstanceOfType(args[i]))
                    return false;
            }
            return true;
        }

        public static void FreeMem(this IntPtr ptr)
        {
            Marshal.FreeCoTaskMem(ptr);
        }
    }
}
