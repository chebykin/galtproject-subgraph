/* eslint-disable prefer-const */ // to satisfy AS compiler

import { log } from '@graphprotocol/graph-ts'

import {
  SetRole,
} from '../types/ACL/ACL'

import { ACLRole, ACLGrantee } from '../types/schema'

export function handleSetRole(event: SetRole): void {
  let roleId = event.params.role.toHexString();
  let role = ACLRole.load(roleId);
  if (role === null) {
    role = new ACLRole(roleId);
    role.grantees = [];
  }

  let granteeId = event.params.candidate.toHexString();
  let grantee = ACLGrantee.load(granteeId);
  if (grantee === null) {
    grantee = new ACLGrantee(granteeId);
  }

  if (event.params.allowed === true) {
    let roleGrantees = role.grantees;
    if (roleGrantees.indexOf(granteeId) === -1) {
      roleGrantees.push(granteeId);
    }
    role.grantees = roleGrantees;
  } else {
    let roleGrantees = role.grantees;
    let roleIndex = roleGrantees.indexOf(granteeId);
    if (roleIndex !== -1) {
      roleGrantees.splice(roleIndex, 1);
    }
    role.grantees = roleGrantees;
  }

  role.save();
  grantee.save();
}
