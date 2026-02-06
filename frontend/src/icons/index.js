//* src/icons/index.js 

//? Ruta para iconos de las opciones

import { FaUsersLine } from "react-icons/fa6";
import { CgEnter } from "react-icons/cg";
import { FaMoneyCheck, FaDollarSign } from "react-icons/fa6";
import { TbBrandDaysCounter } from "react-icons/tb";
import { MdSevereCold } from "react-icons/md";
import { IoMdFingerPrint } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";

//? Export de variable con identificador
export const UsersIcon = FaUsersLine;
export const EnterIcon = CgEnter;
export const MoneyIcon = FaMoneyCheck;
export const DollarIcon = FaDollarSign;
export const CounterIcon = TbBrandDaysCounter;
export const ColdIcon = MdSevereCold;
export const FingerPrintIcon  = IoMdFingerPrint;
export const UserIcon = FaUserAlt;


//? Export como objeto 
export const AdminIcons = {
  UsersIcon,
  EnterIcon,
  MoneyIcon,
  DollarIcon,
  CounterIcon,
  ColdIcon,
  FingerPrintIcon,
  UserIcon
};