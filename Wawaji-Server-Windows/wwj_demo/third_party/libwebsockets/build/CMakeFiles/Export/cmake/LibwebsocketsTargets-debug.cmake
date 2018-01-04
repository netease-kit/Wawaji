#----------------------------------------------------------------
# Generated CMake target import file for configuration "Debug".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "websockets" for configuration "Debug"
set_property(TARGET websockets APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)
set_target_properties(websockets PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_DEBUG "C"
  IMPORTED_LINK_INTERFACE_LIBRARIES_DEBUG "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/\$(Configuration)/zlib_internal.lib;C:/OpenSSL-Win32/lib/VC/libssl32MDd.lib;C:/OpenSSL-Win32/lib/VC/libcrypto32MDd.lib;ws2_32.lib;userenv.lib;psapi.lib;iphlpapi.lib"
  IMPORTED_LOCATION_DEBUG "${_IMPORT_PREFIX}/lib32/websockets_static.lib"
  )

list(APPEND _IMPORT_CHECK_TARGETS websockets )
list(APPEND _IMPORT_CHECK_FILES_FOR_websockets "${_IMPORT_PREFIX}/lib32/websockets_static.lib" )

# Import target "websockets_shared" for configuration "Debug"
set_property(TARGET websockets_shared APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)
set_target_properties(websockets_shared PROPERTIES
  IMPORTED_IMPLIB_DEBUG "${_IMPORT_PREFIX}/lib32/websockets.lib"
  IMPORTED_LINK_INTERFACE_LIBRARIES_DEBUG "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/\$(Configuration)/zlib_internal.lib;C:/OpenSSL-Win32/lib/VC/libssl32MDd.lib;C:/OpenSSL-Win32/lib/VC/libcrypto32MDd.lib;ws2_32.lib;userenv.lib;psapi.lib;iphlpapi.lib"
  IMPORTED_LOCATION_DEBUG "${_IMPORT_PREFIX}/bin/websockets.dll"
  )

list(APPEND _IMPORT_CHECK_TARGETS websockets_shared )
list(APPEND _IMPORT_CHECK_FILES_FOR_websockets_shared "${_IMPORT_PREFIX}/lib32/websockets.lib" "${_IMPORT_PREFIX}/bin/websockets.dll" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
