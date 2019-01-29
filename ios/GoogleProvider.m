//
//  GoogleProvider.m
//  LenddoEFLSdk-Sample
//
//  Created by Neil Mosca on 29/03/2017.
//  Copyright © 2017 Lenddo Pte. Ltd. All rights reserved.
//

#import "GoogleProvider.h"

@implementation GoogleProvider

-(id) init {
    self = [super init];
    self.provider = @"google";
    
    [GIDSignIn sharedInstance].uiDelegate = self;
    [GIDSignIn sharedInstance].clientID = @"593395092220-u0arcuv00rcte6absrfilcj4q358rvsi.apps.googleusercontent.com";
    [GIDSignIn sharedInstance].delegate = self;
    
    [[GIDSignIn sharedInstance] disconnect];
    
    return self;
}

-(void) openSignIn:(NSArray *) scopes {
    NSArray *currentScopes = [GIDSignIn sharedInstance].scopes;
    currentScopes = [currentScopes arrayByAddingObjectsFromArray:scopes];
    [GIDSignIn sharedInstance].scopes = currentScopes;
    
    [[GIDSignIn sharedInstance] signIn];
}

- (void)signIn:(GIDSignIn *)signIn
didSignInForUser:(GIDGoogleUser *)user
     withError:(NSError *)error {
    // Perform any operations on signed in user here.
    LEIdentityToken *identityToken = [[LEIdentityToken alloc] init];
    
    identityToken.provider = self.provider;
    identityToken.oauthVersion = @"2.0";
    identityToken.clientId = user.authentication.clientID;
    identityToken.accessToken = user.authentication.accessToken;
    identityToken.idToken = user.authentication.idToken;
    identityToken.refreshToken = user.authentication.refreshToken;
    
    if ([self.providerDelegate respondsToSelector:@selector(signInWithIdentityToken: withError:)]) {
        [self.providerDelegate signInWithIdentityToken:identityToken withError:error];
    }
}

// This callback is triggered after the disconnect call that revokes data
// access to the user's resources has completed.
- (void)signIn:(GIDSignIn *)signIn
didDisconnectWithUser:(GIDGoogleUser *)user
     withError:(NSError *)error {
    // Perform any operations when the user disconnects from app here.
}

// Implement these methods only if the GIDSignInUIDelegate is not a subclass of
// UIViewController.

// Stop the UIActivityIndicatorView animation that was started when the user
// pressed the Sign In button
- (void)signInWillDispatch:(GIDSignIn *)signIn error:(NSError *)error {

}

// Present a view that prompts the user to sign in with Google
- (void)signIn:(GIDSignIn *)signIn
presentViewController:(UIViewController *)viewController {
    [self.viewController presentViewController:viewController animated:YES completion:nil];
}

// Dismiss the "Sign in with Google" view
- (void)signIn:(GIDSignIn *)signIn
dismissViewController:(UIViewController *)viewController {
    [self.viewController dismissViewControllerAnimated:YES completion:nil];
}

@end
