//* src/icons/index.js 

//? Ruta para iconos de las opciones

import { FaUsersLine } from "react-icons/fa6";
import { CgEnter } from "react-icons/cg";
import { FaMoneyCheck, FaDollarSign } from "react-icons/fa6";
import { TbBrandDaysCounter } from "react-icons/tb";
import { MdSevereCold } from "react-icons/md";

//? Export de variable con identificador
export const UsersIcon = FaUsersLine;
export const EnterIcon = CgEnter;
export const MoneyIcon = FaMoneyCheck;
export const DollarIcon = FaDollarSign;
export const CounterIcon = TbBrandDaysCounter;
export const ColdIcon = MdSevereCold;


//? Export como objeto 
export const AdminIcons = {
  UsersIcon,
  EnterIcon,
  MoneyIcon,
  DollarIcon,
  CounterIcon,
  ColdIcon,
};