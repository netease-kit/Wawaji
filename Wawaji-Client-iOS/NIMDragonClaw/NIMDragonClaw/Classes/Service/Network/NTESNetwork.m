//
//  NTESNetwork.m
//  NIMDragonClaw
//
//  Created by chris on 2017/11/17.
//  Copyright © 2017 Netease. All rights reserved.
//

#import "NTESNetwork.h"
#import "NSDictionary+NTESJson.h"



@interface NTESNetwork ()

@property (nonatomic,assign) NSTimeInterval timeoutInterval;

@property (nonatomic,copy) NSString *host;

@property (nonatomic,strong) NSURLSession    *session;

@end

@implementation NTESNetwork

+ (instancetype)sharedNetwork
{
    static id instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[[self class] alloc] init];
    });
    return instance;
}

- (instancetype)init
{
    if (self = [super init]) {
        _session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
        _host = NTES_API_HOST;
        _timeoutInterval = 30.f;
    }
    return self;
}


- (void)postNetworkTask:(id<NTESNetworkTask>)task completion:(void(^)(NSError *error, id jsonObject))completion
{
    NSMutableURLRequest *request = [self makeRequest:task];

    NSURLSessionTask *sessionTask = [[NSURLSession sharedSession] dataTaskWithRequest:request
                                                completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable connectionError) {
                                                    id jsonObject = nil;
                                                    NSError *resultError = connectionError;
                                                    if (connectionError == nil &&
                                                        [response isKindOfClass:[NSHTTPURLResponse class]] &&
                                                        [(NSHTTPURLResponse *)response statusCode] == 200)
                                                    {
                                                        if (data)
                                                        {
                                                            jsonObject = [NSJSONSerialization JSONObjectWithData:data
                                                                                                         options:NSJSONReadingAllowFragments
                                                                                                           error:&resultError];
                                                            NSInteger code = [jsonObject jsonInteger:@"code"];
                                                            if (code != 200)
                                                            {
                                                                resultError = [NSError errorWithDomain:@"ntes domain"
                                                                                                  code:code
                                                                                              userInfo:@{@"description" : @"invalid code"}];

                                                            }
                                                        }
                                                        else
                                                        {
                                                            resultError = [NSError errorWithDomain:@"ntes domain"
                                                                                        code:-1
                                                                                    userInfo:@{@"description" : @"invalid data"}];
                                                            
                                                        }
                                                    }
                                                    else {
                                                        NSString *msg = [NSString stringWithFormat:@"%@", response];
                                                        resultError = [NSError errorWithDomain:@"ntes domain"
                                                                                          code:-1
                                                                                      userInfo:@{@"description" : msg}];
                                                    }
                                                    
                                                    dispatch_async(dispatch_get_main_queue(), ^{
                                                        if (completion)
                                                        {
                                                            completion(resultError,jsonObject);
                                                        }
                                                    });
                                          }];
    [sessionTask resume];
}


- (NSMutableURLRequest *)makeRequest:(id<NTESNetworkTask>)task
{
    NSAssert([task respondsToSelector:@selector(requestMethod)], @"task must have a requestMethod!");
    NSString *urlString = [self.host stringByAppendingPathComponent:task.requestMethod];

    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:urlString] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:self.timeoutInterval];
    
    [request setHTTPMethod:@"POST"];
    [request addValue:@"dolls-catcher" forHTTPHeaderField:@"Demo-Id"];
    [request addValue:@"application/x-www-form-urlencoded;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    
    if ([task respondsToSelector:@selector(param)] && [task.param isKindOfClass:[NSDictionary class]])
    {
        NSString *param = [self urlEncodedString:task.param];
        [request setHTTPBody:[param dataUsingEncoding:NSUTF8StringEncoding]];
    }
        
    return request;
}


- (NSString *)urlEncodedString:(NSDictionary *)param
{
    NSMutableArray *parts = [NSMutableArray array];
    for (id key in param) {
        id value = [param objectForKey: key];
        NSString *part = [NSString stringWithFormat: @"%@=%@", urlencode(key), urlencode(toString(value))];
        [parts addObject: part];
    }
    return [parts componentsJoinedByString: @"&"];
}


static NSString *toString(id object) {
    return [NSString stringWithFormat: @"%@", object];
}

static NSString *urlencode(NSString * unencodedString) {
    NSString * encodedString = (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(
                                                                                                     NULL,
                                                                                                     (__bridge CFStringRef)unencodedString,
                                                                                                     NULL,
                                                                                                     (CFStringRef)@"!*'();:@&=+$,/?%#[]",
                                                                                                     kCFStringEncodingUTF8 );
    return encodedString;
}


@end
