/** Adapter pattern works as a bridge between two incompatible interfaces. 
This type of design pattern comes under structural pattern as this pattern combines the capability 
of two independent interfaces.

Used when we want some component having extra features than the current component, but the current one
is incompatible with the new one.
*/

interface OldApi {
  getUserInfo(userId: string): string;
}

interface NewApi {
  getUserDetails(userId: string): { id: string; name: string };
}

class UserAdapter implements NewApi {
  constructor(private oldApi: OldApi) {}

  getUserDetails(userId: string): { id: string; name: string } {
    const userInfo = this.oldApi.getUserInfo(userId);
    // add something extra
    return userInfo;
  }
}

const oldApi = new OldApi();
const userAdapter = new UserAdapter(oldApi);
console.log(userAdapter.getUserDetails());
