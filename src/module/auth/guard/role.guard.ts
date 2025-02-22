
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { ERole } from 'src/database/entity/user.entity';
 
const RoleGuard = (role: ERole): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<any>();
      const user = request.user;
      return user?.role ===role
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;