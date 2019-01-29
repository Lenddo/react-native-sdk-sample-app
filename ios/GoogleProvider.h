//
//  GoogleProvider.h
//  LenddoEFLSdk-Sample
//
//  Created by Neil Mosca on 29/03/2017.
//  Copyright © 2017 Lenddo Pte. Ltd. All rights reserved.
//

#import <LenddoEFLSdk/LEProvider.h>
@import GoogleSignIn;
// #import <Google/SignIn.h> // if you are using Google/SignIn for dependencies in Cocoapods

@interface GoogleProvider : LEProvider <GIDSignInUIDelegate, GIDSignInDelegate>

@end
