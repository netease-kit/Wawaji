# Install script for directory: D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "C:/Program Files (x86)/libwebsockets")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xlibrariesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/Debug/websockets_static.lib")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/Release/websockets_static.lib")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/MinSizeRel/websockets_static.lib")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/RelWithDebInfo/websockets_static.lib")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xdevx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE FILE FILES
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/lib/libwebsockets.h"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lws_config.h"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/plugins/ssh-base/include/lws-plugin-ssh.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xlibrariesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY OPTIONAL FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/Debug/websockets.lib")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY OPTIONAL FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/Release/websockets.lib")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY OPTIONAL FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/MinSizeRel/websockets.lib")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib32" TYPE STATIC_LIBRARY OPTIONAL FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lib/RelWithDebInfo/websockets.lib")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xlibrariesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/websockets.dll")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/websockets.dll")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/websockets.dll")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE SHARED_LIBRARY FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/websockets.dll")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xdevx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE FILE FILES
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/lib/libwebsockets.h"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/lws_config.h"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/plugins/ssh-base/include/lws-plugin-ssh.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/libwebsockets-test-server.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/libwebsockets-test-server.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/libwebsockets-test-server.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/libwebsockets-test-server.exe")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/libwebsockets-test-server-extpoll.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/libwebsockets-test-server-extpoll.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/libwebsockets-test-server-extpoll.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/libwebsockets-test-server-extpoll.exe")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/libwebsockets-test-client.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/libwebsockets-test-client.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/libwebsockets-test-client.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/libwebsockets-test-client.exe")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/libwebsockets-test-fraggle.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/libwebsockets-test-fraggle.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/libwebsockets-test-fraggle.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/libwebsockets-test-fraggle.exe")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/libwebsockets-test-ping.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/libwebsockets-test-ping.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/libwebsockets-test-ping.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/libwebsockets-test-ping.exe")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Debug/libwebsockets-test-echo.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/Release/libwebsockets-test-echo.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/MinSizeRel/libwebsockets-test-echo.exe")
  elseif("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/bin/RelWithDebInfo/libwebsockets-test-echo.exe")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/libwebsockets-test-server" TYPE FILE FILES
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/favicon.ico"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/leaf.jpg"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/candide.zip"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/libwebsockets.org-logo.png"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/http2.png"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/lws-common.js"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/test.html"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/libwebsockets-test-server/private" TYPE FILE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/private/index.html")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xexamplesx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/libwebsockets-test-server" TYPE FILE FILES
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/lws-ssh-test-keys"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/test-apps/lws-ssh-test-keys.pub"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xdevx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/LibwebsocketsConfig.cmake"
    "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/LibwebsocketsConfigVersion.cmake"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xdevx" OR NOT CMAKE_INSTALL_COMPONENT)
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/LibwebsocketsTargets.cmake")
    file(DIFFERENT EXPORT_FILE_CHANGED FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/LibwebsocketsTargets.cmake"
         "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/Export/cmake/LibwebsocketsTargets.cmake")
    if(EXPORT_FILE_CHANGED)
      file(GLOB OLD_CONFIG_FILES "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/LibwebsocketsTargets-*.cmake")
      if(OLD_CONFIG_FILES)
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/cmake/LibwebsocketsTargets.cmake\" will be replaced.  Removing files [${OLD_CONFIG_FILES}].")
        file(REMOVE ${OLD_CONFIG_FILES})
      endif()
    endif()
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/Export/cmake/LibwebsocketsTargets.cmake")
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/Export/cmake/LibwebsocketsTargets-debug.cmake")
  endif()
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/Export/cmake/LibwebsocketsTargets-minsizerel.cmake")
  endif()
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/Export/cmake/LibwebsocketsTargets-relwithdebinfo.cmake")
  endif()
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/cmake" TYPE FILE FILES "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/CMakeFiles/Export/cmake/LibwebsocketsTargets-release.cmake")
  endif()
endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "D:/yinshipin/Embedded/branch/gaoqi/wwj_demo/third_party/libwebsockets/build/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
