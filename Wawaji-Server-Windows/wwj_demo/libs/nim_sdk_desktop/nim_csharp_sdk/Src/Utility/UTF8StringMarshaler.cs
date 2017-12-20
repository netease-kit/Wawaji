using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace NimUtility
{
    /// <summary>
    /// Marshal unicode string param to utf-8 string,usage:[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(Utf8StringMarshaler))]
    /// </summary>
    public class Utf8StringMarshaler : ICustomMarshaler
    {
        public void CleanUpManagedData(object ManagedObj)
        {
        }

        public void CleanUpNativeData(IntPtr pNativeData)
        {
            Marshal.FreeHGlobal(pNativeData);
        }

        public int GetNativeDataSize()
        {
            return -1;
        }

        public IntPtr MarshalManagedToNative(object ManagedObj)
        {
            if (object.ReferenceEquals(ManagedObj, null))
                return IntPtr.Zero;
            if (!(ManagedObj is string))
                throw new InvalidOperationException();
            byte[] utf8bytes = Encoding.UTF8.GetBytes(ManagedObj as string);
            IntPtr ptr = Marshal.AllocHGlobal(utf8bytes.Length + 1);
            Marshal.Copy(utf8bytes, 0, ptr, utf8bytes.Length);
            Marshal.WriteByte(ptr, utf8bytes.Length, 0);
            return ptr;
        }

        public object MarshalNativeToManaged(IntPtr pNativeData)
        {
            if (pNativeData == IntPtr.Zero)
                return null;
            List<byte> bytes = new List<byte>();
            for (int offset = 0; ; offset++)
            {
                byte b = Marshal.ReadByte(pNativeData, offset);
                if (b == 0) 
                    break;
                else bytes.Add(b);
            }
            
            var str = Encoding.UTF8.GetString(bytes.ToArray(), 0, bytes.Count);
            return str;
        }

        public static ICustomMarshaler GetInstance(string s)
        {
            return new Utf8StringMarshaler();
        }
    }
}
