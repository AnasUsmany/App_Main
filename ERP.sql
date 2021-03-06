USE [master]
GO
/****** Object:  Database [ERP]    Script Date: 08/05/2021 12:39:32 ******/
CREATE DATABASE [ERP]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ERP', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\ERP.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ERP_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\ERP_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [ERP] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ERP].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ERP] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ERP] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ERP] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ERP] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ERP] SET ARITHABORT OFF 
GO
ALTER DATABASE [ERP] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ERP] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ERP] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ERP] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ERP] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ERP] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ERP] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ERP] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ERP] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ERP] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ERP] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ERP] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ERP] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ERP] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ERP] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ERP] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ERP] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ERP] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ERP] SET  MULTI_USER 
GO
ALTER DATABASE [ERP] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ERP] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ERP] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ERP] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ERP] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ERP] SET QUERY_STORE = OFF
GO
USE [ERP]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [ERP]
GO
/****** Object:  UserDefinedFunction [dbo].[splitstring]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--------------- SPLITSTRING FUNCTION -----------    
CREATE FUNCTION [dbo].[splitstring] ( @stringToSplit VARCHAR(MAX) )    
    RETURNS    
        @returnList TABLE ([Param] [nvarchar] (500))    
AS    
     
BEGIN    
     
    DECLARE @name NVARCHAR(MAX)    
    DECLARE @pos INT    
     
    WHILE CHARINDEX(',', @stringToSplit) > 0    
    BEGIN    
        SELECT @pos  = CHARINDEX(',', @stringToSplit)     
        SELECT @name = SUBSTRING(@stringToSplit, 1, @pos-1)    
     
        INSERT INTO @returnList    
        SELECT @name    
     
        SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos+1, LEN(@stringToSplit)-@pos)    
    END    
     
    INSERT INTO @returnList    
    SELECT @stringToSplit    
    RETURN    
END    
--------------- SPLITSTRING FUNCTION END -----------    
------------------------------------------------    
--FUNCTIONS END    
------------------------------------------------ 
GO
/****** Object:  Table [dbo].[uac_user]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_user](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[ProfilePicPath] [varchar](250) NULL,
	[Email] [varchar](250) NULL,
	[UserName] [varchar](250) NULL,
	[password] [varchar](250) NULL,
	[MobilePhone] [varchar](25) NULL,
	[StoreId] [int] NULL,
	[BillerId] [int] NULL,
	[CompanyName] [varchar](100) NULL,
	[IsAppOwner] [bit] NULL,
	[Name] [varchar](250) NULL,
	[City] [varchar](100) NULL,
	[State] [varchar](100) NULL,
	[ZipCode] [varchar](25) NULL,
	[CustomerGroupId] [int] NULL,
	[IsActive] [bit] NULL,
	[IsDeleted] [bit] NULL,
	[IsAllowLogin] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedOn] [datetime] NULL,
	[UpdatedBy] [int] NULL,
	[UpdatedOn] [datetime] NULL,
	[Ip] [varchar](50) NULL,
	[Mac] [varchar](50) NULL,
 CONSTRAINT [PK_uac_user] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_CheckUserEmail]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_CheckUserEmail]
(
    @Email varchar(50)
    
)
RETURNS TABLE AS RETURN
(
   select CASE WHEN COUNT(*) >0 then 1 else 0 end as Tcount from uac_user where email = @Email
)
GO
/****** Object:  Table [dbo].[uaa_actions]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uaa_actions](
	[ActionId] [int] IDENTITY(1,1) NOT NULL,
	[ModuleId] [int] NULL,
	[ActionName] [varchar](2000) NULL,
	[ActionTitle] [varchar](2000) NULL,
	[ControllerName] [varchar](2000) NULL,
	[Description] [varchar](5000) NULL,
	[SortNumber] [int] NULL,
	[IsPublic] [bit] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_dit_uaa_actions] PRIMARY KEY CLUSTERED 
(
	[ActionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uaa_modules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uaa_modules](
	[ModuleId] [int] IDENTITY(1,1) NOT NULL,
	[ModuleName] [varchar](2000) NULL,
	[Description] [varchar](5000) NULL,
	[IconCode] [varchar](250) NULL,
	[IsActive] [bit] NULL,
	[SortNumber] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[ModifiedDate] [datetime] NULL,
	[Ip] [varchar](50) NULL,
	[Mac] [varchar](100) NULL,
 CONSTRAINT [PK_dit_uaa_modules] PRIMARY KEY CLUSTERED 
(
	[ModuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uac_policy]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_policy](
	[PolicyId] [int] IDENTITY(1,1) NOT NULL,
	[PolicyName] [varchar](2000) NULL,
	[Description] [varchar](5000) NULL,
	[IsActive] [bit] NULL,
	[IsDeleted] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedBy] [int] NULL,
	[UpdatedDate] [datetime] NULL,
	[MacAddress] [varchar](500) NULL,
	[Ip] [varchar](500) NULL,
 CONSTRAINT [PK_uac_policy] PRIMARY KEY CLUSTERED 
(
	[PolicyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uac_policy_actions]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_policy_actions](
	[PaId] [bigint] IDENTITY(1,1) NOT NULL,
	[PolicyId] [int] NULL,
	[ModuleId] [int] NULL,
	[ActionId] [int] NULL,
 CONSTRAINT [PK_uac_policy_actions] PRIMARY KEY CLUSTERED 
(
	[PaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uac_policy_modules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_policy_modules](
	[PmId] [bigint] IDENTITY(1,1) NOT NULL,
	[PolicyId] [int] NULL,
	[ModuleId] [int] NULL,
 CONSTRAINT [PK_dit_uac_policy_modules] PRIMARY KEY CLUSTERED 
(
	[PmId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uac_role]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_role](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [varchar](250) NULL,
	[IsActive] [bit] NULL,
	[IsDeleted] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedOn] [datetime] NULL,
	[UpdatedBy] [int] NULL,
	[UpdatedOn] [datetime] NULL,
	[Ip] [varchar](50) NULL,
	[Mac] [varchar](50) NULL,
 CONSTRAINT [PK_dit_uac_role] PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uac_role_policies]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_role_policies](
	[RpId] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NULL,
	[PolicyId] [int] NULL,
 CONSTRAINT [PK_uac_role_policies] PRIMARY KEY CLUSTERED 
(
	[RpId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[uac_user_role]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[uac_user_role](
	[UrId] [bigint] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NULL,
	[UserId] [int] NULL,
 CONSTRAINT [PK_uac_user_role] PRIMARY KEY CLUSTERED 
(
	[UrId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[uac_user] ADD  DEFAULT ((0)) FOR [IsAppOwner]
GO
ALTER TABLE [dbo].[uac_user] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
/****** Object:  StoredProcedure [dbo].[sp_aac_getModules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_aac_getModules]
@moduleid int
AS
BEGIN
SET NOCOUNT ON;
if(@moduleid is null or @moduleid = 0)
begin
select m.ModuleId,
m.ModuleName,
m.[Description],
m.IsActive,
m.IconCode
from uaa_modules m
end
else
begin
select * from uaa_modules where moduleid = @moduleid
end
END
GO
/****** Object:  StoredProcedure [dbo].[sp_uac_getValuesForSession]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--[dbo].[sp_uac_getValuesForSession] 1  
CREATE PROCEDURE [dbo].[sp_uac_getValuesForSession]   
--DECLARE  
@userid int  --=1  
AS    
BEGIN    
Select    
u.[Name],   
u.[UserName],       
u.[email],    
u.ProfilePicPath,
u.[UserId],    
u.[IsAppOwner],
r.RoleName
    
from [uac_user] (NOLOCK) u   
left join  [uac_user_role] (NOLOCK) ur on ur.userid = u.userid
left join uac_role (NOLOCK) r on r.roleid = ur.roleid
WHERE u.[userid] = @userid    
    
    
--getroleid    
declare @RoleId int = (select roleid from uac_user_role (NOLOCK)  where userid = @userid)    
    
--get Modules    
select pm.[ModuleId] ,m.ModuleName,m.SortNumber  ,IconCode  
from uac_policy_modules (NOLOCK)  pm    
inner join uaa_modules (NOLOCK)  m on pm.[moduleid] = m.[moduleid]    
where pm.[policyid] in (select [policyid] from uac_role_policies (NOLOCK)  where roleid = @RoleId)    
and isActive = 1  
union    
Select distinct pa.ModuleId ,m.ModuleName,m.SortNumber  ,IconCode  
from uac_policy_actions (NOLOCK)  pa    
inner join uac_role_policies (NOLOCK)  up on (pa.[policyid] = up.[policyid] and up.[roleid] = @RoleId)    
inner join uaa_modules m on pa.[moduleid] = m.[moduleid]    
and isActive = 1  
union    
Select distinct pa.ModuleId ,m.ModuleName,m.SortNumber  ,IconCode 
from uac_user_role (NOLOCK)  ug    
inner join uac_role_policies (NOLOCK)  gp on ug.[roleid] = gp.[roleid]    
inner join uac_policy_actions (NOLOCK)  pa on gp.[policyid] = pa.[policyid]    
inner join uaa_modules (NOLOCK)  m on pa.[moduleid] = m.[moduleid]    
where ug.[userid]= @userid  and isActive = 1  
    
    
order by [sortNumber]    
    

select a.[Actionid],a.[Moduleid],a.[ActionName],a.[ControllerName],a.[SortNumber], m.[ModuleName]  ,ActionTitle  
from uaa_actions (NOLOCK)  a    
inner join uaa_modules (NOLOCK)  m on a.[moduleid] = m.[moduleid]    
where [isPublic] = 1  
and a.isActive = 1  
union    
select pa.[Actionid] ,a.[Moduleid], a.[ActionName], a.[ControllerName],a.[SortNumber],m.[ModuleName]  ,ActionTitle  
from uac_policy_actions (NOLOCK)  pa    
inner join uaa_actions (NOLOCK)  a on pa.[actionid] = a.[actionid]    
inner join uaa_modules (NOLOCK)  m on a.[moduleid] = m.[moduleid]    
where pa.[policyid] in (select [policyid] from uac_role_policies (NOLOCK)  where roleid = @RoleId)    
and a.isActive = 1  
union    
select pa.[Actionid] ,a.[Moduleid], a.[ActionName], a.[ControllerName],a.[SortNumber],m.[ModuleName]  ,ActionTitle  
from uac_policy_actions (NOLOCK)  pa    
inner join uaa_actions (NOLOCK)  a on pa.[actionid] = a.[actionid]    
inner join uaa_modules (NOLOCK)  m on a.[moduleid] = m.[moduleid]    
where pa.[policyid] in (Select gp.policyid from uac_user_role (NOLOCK)  ug    
						inner join uac_role_policies (NOLOCK)  gp on ug.roleid = gp.roleid    
where ug.userid = @userid)    
and a.isActive = 1  
order by [controllerName],[sortNumber]      

END    
SET ANSI_NULLS ON
GO
/****** Object:  StoredProcedure [dbo].[usp_DeleteInsertUserGroup]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_DeleteInsertUserGroup]
@userid int,
@roleid int
AS
BEGIN
delete from uac_user_role where userid = @userid
insert into uac_user_role(userid,roleid)values(@userid,@roleid)
END
GO
/****** Object:  StoredProcedure [dbo].[usp_DeleteUser]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_DeleteUser]  
@userId int,  
@permanentDelete bit  
AS  
BEGIN  
if(@permanentDelete= 0)  
begin  
update uac_user set isDeleted = 1,isActive = 0,email= '' where userid = @userId
select 'User Soft Deleted' as msg,1 as msgType,@userId as returnId  
--SELECT 'Policy deleted successfully' as msg,1 as msgType,@policyid as returnId     
end  
else   
begin  
delete from uac_user where userid = @userId  
select 'User Deleted' as msg,1 as msgType,@userId as returnId  
--after orders if user has done some order then donot delete user  
end  
END
GO
/****** Object:  StoredProcedure [dbo].[usp_GetActions]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_GetActions]
	
AS
BEGIN
	select * from uaa_actions WITH (NOLOCK)
END
GO
/****** Object:  StoredProcedure [dbo].[usp_GetModules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--[dbo].[usp_GetModules]
CREATE PROCEDURE [dbo].[usp_GetModules]
	
AS
BEGIN
	select * from uaa_modules WITH (NOLOCK)
  

END
GO
/****** Object:  StoredProcedure [dbo].[usp_getUserAndDetails]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_getUserAndDetails]  
@userid int  
AS  
BEGIN  
select u.*,ISNULL(r.roleid,0) as roleid from uac_user u  
left join uac_user_role r on r.userid = u.userid 
where u.userid = @userid 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_GetUsers]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_GetUsers]     
@isActive bit   
,@take  int
,@skip int

AS        
--DECLARE     
--@isActive bit =1    
BEGIN        
Select         
      userid,        
      userName,
	  [Name],
      email,
	  isActive,
	  Count(*) over() TotalRows
from uac_user        
where (isActive = @isActive or @isActive is null)        
AND (isDeleted = 0 or isDeleted is null)      
AND (isAppOwner =0 or isAppOwner is null)      
AND userName is not null  
order by userid asc  
  OFFSET @Skip ROWS                                           
FETCH NEXT @Take ROWS ONLY 
END 
GO
/****** Object:  StoredProcedure [dbo].[usp_SaveRolePolicies]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_SaveRolePolicies]
@roleid int,
@policyid int
AS 
BEGIN
insert into uac_role_policies(roleid,policyid) values(@roleid,@policyid)
END
GO
/****** Object:  StoredProcedure [dbo].[usp_SaveUser]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_SaveUser]
@UserId int
,@ProfilePicPath varchar(250)
,@Name varchar(25)
,@City varchar(25)
,@State varchar(25)
,@ZipCode  varchar(25)
,@mobilePhone  varchar(25)
,@email  varchar(50)
,@userName varchar(15)
,@password varchar(15)
,@isActive bit
,@createdBy int 
,@createdOn datetime
,@ip varchar(50)
,@mac varchar(100)
,@CompanyName varchar(50)
,@IsAllowLogin bit
AS
BEGIN
if(@userid=0 or @userid is null)
BEGIN
INSERT INTO uac_user
(
ProfilePicPath
,[Name]
,city
,[state]
,zipCode
,mobilePhone
,email
,userName
,[password]
,CompanyName
,isActive
,createdBy
,createdOn
,[ip]
,[mac]
,IsAllowLogin
)values
(
@profilePicPath
,@Name
,@city 
,@state
,@zipCode
,@mobilePhone
,@email  
,@userName
,@password
,@CompanyName
,@isActive 
,@createdBy
,@createdOn
,@ip 
,@mac
,@IsAllowLogin
)
select SCOPE_IDENTITY() as returnId, '1' as msgType,'User Created Succesfully!' as msg
END
ELSE
BEGIN
update uac_user
set
ProfilePicPath = @profilePicPath
,[Name] = @Name
,city =@city
,[state] = @state
,zipCode = @zipCode
,mobilePhone = @mobilePhone
,email = @email
,CompanyName = @CompanyName
,isActive =@isActive
,updatedBy = @createdBy
,updatedOn =@createdOn
,[ip] =@ip
,[mac] =@mac
,IsAllowLogin =@IsAllowLogin
where userid = @userid
select @userid as returnId, '1' as msgType,'User Updated Succesfully!' as msg
END
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_deleteAction]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[usp_uaa_deleteAction]  
@actionid int ,  
@permanentDelete bit  
AS  
BEGIN  
SET NOCOUNT ON;  
if(@permanentDelete = 0)  
begin  
if exists(select 1 from uac_policy_modules where [moduleid] = (Select [moduleid] from uaa_actions where [actionid] = @actionid and [isPublic] = 0) union select 1 from uac_policy_actions where [actionid] = @actionid )  
begin  
SELECT 'Unable to delete this action due to dependency(s) in Policy. &nbsp;(Tip! Check Policy Recycle Bin)' as msg,2 as msgType,@actionid as returnId  
end  
else  
begin  
update uaa_actions set isActive = 0,modifiedDate = GetDate() where actionid = @actionid  
if not EXISTS(select 1 from uaa_actions where actionid = @actionid and isActive = 1)  
begin  
SELECT 'Action deleted successfully' as msg,1 as msgType,@actionid as returnId  
end  
else  
begin  
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@actionid as returnId  
end  
end  
end  
else  
begin  
delete from uaa_actions where actionid = @actionid  
if not exists(select 1 from uaa_actions where actionid = 0)  
begin  
SELECT 'Action deleted successfully' as msg,1 as msgType,@actionid as returnId  
end  
else  
begin  
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@actionid as returnId  
end  
end  
END  
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_deleteModule]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uaa_deleteModule]
@moduleid int ,
@permanentDelete bit
AS
BEGIN
SET NOCOUNT ON;
if(@permanentDelete = 0)
begin
if exists(SELECT 1 FROM ( SELECT [moduleid] FROM uaa_actions UNION SELECT [moduleid] FROM uac_policy_modules UNION SELECT [moduleid] FROM uac_policy_actions)x
WHERE x.[moduleid]= @moduleid)
begin
SELECT 'Unable to delete this module due to dependency(s) in Policy or Actions. &nbsp;(Tip! Check Policy/Modules Recycle Bins)' as msg,2 as msgType,@moduleid as returnId
end
else
begin
update uaa_modules set isActive = 0,modifiedDate = GetDate() where moduleid = @moduleid
if not EXISTS(select 1 from uaa_modules where moduleid = @moduleid and isActive = 0)
begin
SELECT 'Module deleted successfully' as msg,1 as msgType,@moduleid as returnId
end
else
begin
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@moduleid as returnId
end
end
end
else
begin
delete from uaa_modules where moduleid = @moduleid and isActive = 0
if not exists(select 1 from uaa_modules where moduleid = @moduleid)
begin
SELECT 'Module deleted successfully' as msg,1 as msgType,@moduleid as returnId
end
else
begin
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@moduleid as returnId

end
end
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_GetAction]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================  
-- Author:  <Author,,Name>  
-- Create date: <Create Date,,>  
-- Description: <Description,,>  
-- =============================================  
CREATE PROCEDURE [dbo].[usp_uaa_GetAction]   
 -- Add the parameters for the stored procedure here  
 @actionid int  
AS  
BEGIN  
 if(@actionid = 0)  
 BEGIN  
  SELECT 
       a.*
	   ,m.ModuleName
            
  FROM uaa_actions a WITH(NOLOCK)  
  INNER JOIN uaa_modules m WITH(NOLOCK) ON m.moduleId = a.moduleId  
 END  
 ELSE  
 BEGIN  
  SELECT 
        a.*
	   ,m.ModuleName
            
  FROM uaa_actions a WITH(NOLOCK)  
  INNER JOIN uaa_modules m WITH(NOLOCK) ON m.moduleId = a.moduleId 
      
    WHERE a.actionId = @actionid  
 END  
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_GetActions]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uaa_GetActions] --1,0        
 -- Add the parameters for the stored procedure here        
 @isActive bit,      
 @isPublic bit      
AS        
BEGIN      
       
  SELECT     
          a.*
	   ,m.ModuleName
            
           FROM uaa_actions a WITH(NOLOCK)        
     INNER JOIN uaa_modules m WITH(NOLOCK) ON m.moduleId = a.moduleId      
  WHERE (a.isActive = @isActive OR @isActive is null)
  AND   a.isPublic = @isPublic      
END 
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_getActiveModules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uaa_getActiveModules]-- 1       
@isactive bit        
AS        
BEGIN        
SET NOCOUNT ON;        
select *     
from uaa_modules m  WITH (NOLOCK)      
where (m.isActive = @isactive OR @isactive is null)  
order by m.sortNumber   
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_getModules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uaa_getModules]
@moduleid int
AS
BEGIN
SET NOCOUNT ON;
if(@moduleid is null or @moduleid = 0)
begin
select 
*
from uaa_modules m
end
else
begin
select * from uaa_modules where moduleid = @moduleid
end
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_saveAction]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uaa_saveAction]    
@Actionid int    
,@Moduleid int    
,@ActionName varchar(255)    
,@ActionTitle varchar(250)    
,@ControllerName varchar(250)    
,@Description varchar(5000)    
,@IsActive bit    
,@IsPublic bit    
,@SortNumber int
,@CreatedBy int
,@CreatedDate datetime   
AS    
BEGIN    
SET NOCOUNT ON;    
IF(@actionid=0 OR @actionid IS NULL)    
BEGIN    
if exists(SELECT 1 FROM uaa_actions WHERE actionName = @actionName)    
begin    
SELECT 'Action Name already exists' as msg,2 as msgType,@actionid as returnId    
end    
else    
begin    
INSERT INTO uaa_actions    
([moduleId],[actionName],[actionTitle],[controllerName],[description],[isActive],[isPublic],[sortNumber],createdBy,createdDate)    
VALUES    
(@moduleid,@actionName,@actionTitle,@controllerName,@description,@isActive,@isPublic,@sortNumber,@createdBy,@createdDate)    
SET @actionid=SCOPE_IDENTITY()    
SELECT 'Action created successfully' as msg,1 as msgType,@actionid as returnId    
end    
END    
ELSE    
BEGIN    
IF EXISTS(SELECT 1 FROM uaa_actions WHERE actionName = @actionName AND actionId <> @actionid)    
begin    
SELECT 'Action Name already exists' as msg,2 as msgType,@actionid as returnId    
end    
else    
begin    
UPDATE uaa_actions    
SET     
[moduleId] = @moduleid    
,[actionName] = @actionName    
,[actionTitle] = @actionTitle    
,[controllerName] = @controllerName    
,[description] = @description    
,[isActive] = @isActive    
,[isPublic] = @isPublic    
,[sortNumber] = @sortNumber  
,[modifiedBy] = @createdBy
,[modifiedDate] = @createdDate  
WHERE actionId = @actionid    
SELECT 'Action updated successfully' as msg,1 as msgType,@actionid as returnId    
end    
END    
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uaa_saveModule]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uaa_saveModule]  
@Moduleid int  
,@ModuleName varchar(2000)  
,@IconCode varchar(250)  
,@Description varchar(5000)  
,@IsActive bit  
,@SortNumber int 
,@CreatedBy int
,@CreatedDate datetime 
AS  
BEGIN  
SET NOCOUNT ON;  
IF(@moduleid=0 OR @moduleid IS NULL)  
BEGIN  
if exists(SELECT 1 FROM uaa_modules WHERE moduleName = @moduleName)  
begin  
SELECT 'Module Name already exists' as msg,2 as msgType,@moduleid as returnId  
end  
else  
begin  
INSERT INTO uaa_modules  
([moduleName],[iconCode],[description],[isActive],[sortNumber],createdBy,createdDate)  
VALUES  
(@moduleName,@iconCode,@description,@isActive,@sortNumber,@createdBy,@createdDate)  
SET @moduleid=SCOPE_IDENTITY()  
SELECT 'Module created successfully' as msg,1 as msgType,@moduleid as returnId  
end  
END  
ELSE  
BEGIN  
IF EXISTS(SELECT 1 FROM uaa_modules WHERE moduleName = @moduleName AND moduleid <> @moduleid)  
begin  
SELECT 'Module Name already exists' as msg,2 as msgType,@moduleid as returnId  
end  
else  
begin  
UPDATE uaa_modules  
SET [moduleName] = @moduleName  
,[iconCode] = @iconCode  
,[description] = @description  
,[isActive] = @isActive  
,[sortNumber] = @sortNumber
,[modifiedBy] = @createdBy
,[modifiedDate] = @createdDate  
WHERE moduleid=@moduleid 
 
SELECT 'Module updated successfully' as msg,1 as msgType,@moduleid as returnId  
end  
END  
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_deleteGroup]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_deleteGroup]
@roleid int ,
@permanentDelete bit
AS
BEGIN
SET NOCOUNT ON;
if EXISTS(select 1 from uac_user_role where roleid = @roleid)
begin
SELECT 'This group cannot be deleted because it is assigned to user(s)' as msg,2 as msgType,@roleid as returnId
end
else
begin
update uac_role set isDeleted = 1 , updatedOn = getDate() where roleid = @roleid
if not EXISTS(select 1 from uac_role where roleid = @roleid and isDeleted = 0)
begin
SELECT 'Group deleted successfully' as msg,1 as msgType,@roleid as returnId
end
else
begin
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@roleid as returnId
end
end
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_deletePolicy]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_deletePolicy]  
@policyid int ,  
@permanentDelete bit  
AS  
BEGIN  
SET NOCOUNT ON;  
Declare   
--@policyusedByuser int,  
@PolicyusedBygroup int;  
  
--SET @policyusedByuser = (Select Count(1) from [bem_uac_user_policy] Where policyid = @policyid);  
SET @policyusedBygroup = (Select Count(1) from [uac_role_policies] Where policyid = @policyid);  
IF(@policyusedBygroup > 0)  
BEGIN  
SELECT 'Show Popup' as msg,3 as msgType,@policyid as returnId;  
END  
ELSE  
BEGIN  
if(@permanentDelete = 0)  
begin  
update uac_policy set isDeleted = 1 , updatedDate = getDate() where policyid = @policyid  
if not EXISTS(select 1 from uac_policy where policyid = @policyid and isDeleted = 0)  
begin  
SELECT 'Policy deleted successfully' as msg,1 as msgType,@policyid as returnId  
end  
else  
begin  
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@policyid as returnId  
end  
end  
else  
begin  
delete from uac_policy where policyid = @policyid and isDeleted = 1  
if not exists(select 1 from uac_policy where policyid = @policyid)  
begin  
DELETE from [uac_policy_actions] where [policyid] = @policyid  
DELETE from [uac_policy_modules] where [policyid] = @policyid  
SELECT 'Policy deleted successfully' as msg,1 as msgType,@policyid as returnId  
end  
else  
begin  
SELECT 'Delete unsuccessful!' as msg,2 as msgType,@policyid as returnId  
end  
end  
END --  
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_getGroups]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_getGroups]
@IsDeleted bit
,@RoleId int
AS
BEGIN
SET NOCOUNT ON;
if(@isDeleted is not null and @roleid is null )
begin
select g.[roleId],g.[RoleName],g.[IsActive],g.[CreatedBy],g.[CreatedOn],g.[Ip]
from uac_role g 
where g.[isDeleted] = @isDeleted
end
else
begin

select g.[RoleId],g.[RoleName],g.[IsActive],g.[CreatedBy],g.[CreatedOn],g.[Ip]
from uac_role g 
where g.[isDeleted] = @isDeleted
AND g.roleid = @roleid 


select g.[RpId],g.[Roleid],g.[Policyid],p.[PolicyName]
from [uac_role_policies] g
inner join [uac_policy] p on p.[policyid] = g.[policyid]
where g.[roleid] = @roleid



end
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_getPolicies]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_getPolicies]
@IsDeleted bit,
@IsGrid bit
AS
BEGIN
SET NOCOUNT ON;
if(@isGrid = 1)
begin
SELECT *
FROM [uac_policy] p
WHERE p.[isDeleted] = @isDeleted
end
else
begin
SELECT *
FROM [uac_policy] p
WHERE p.[isDeleted] = @isDeleted and p.[isActive] = 1
end
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_getPolicyAndDetails]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--[sp_uac_getPolicyAndDetails] 3    
--[dbo].[usp_uac_getPolicyAndDetails] 0   
CREATE PROCEDURE [dbo].[usp_uac_getPolicyAndDetails]    
@PolicyId int    
AS    
BEGIN    
IF(@policyid is null or @policyid = 0)    
BEGIN    
SELECT m.ModuleId,m.ModuleName, m.IconCode    
FROM uaa_modules m    
WHERE  m.[isActive] = 1    
    
SELECT a.ActionId,a.ModuleId,a.ActionName,a.[ActionTitle],a.[ControllerName],a.[Description],a.[IsActive]    
FROM uaa_actions a    
WHERE  
 a.[isPublic] = 0 and  
 a.[isActive] = 1     
    
END    
ELSE    
BEGIN    
    
SELECT p.[Policyid],p.[PolicyName],p.[Description],p.[IsActive]    
FROM [uac_policy] p    
WHERE p.[policyid] = @policyid    
    
SELECT m.[ModuleId],m.[ModuleName],m.[Description],m.[IsActive],pmid = isnull(pm.[pmid],0),m.[IconCode]    
FROM uaa_modules m    
LEFT JOIN uac_policy_modules pm ON (m.[moduleid] = pm.[moduleid] and pm.[policyid] = @policyid)    
WHERE [isActive] = 1    
--ORDER BY m.[moduleName]    
    
SELECT a.ActionId,a.ModuleId,a.ActionName,a.ActionTitle,a.[Description]    
,paid = isnull(pa.[paid],0) 
FROM uaa_actions a    
LEFT JOIN uac_policy_actions pa ON (a.[actionid] = pa.[actionid] and pa.[policyid] = @policyid)    
WHERE a.[isPublic] = 0 and a.[isActive] = 1 -- AND a.[isDeleted] = 0    
--ORDER BY a.[moduleid],a.[actionName]    
    
SELECT pa.[Policyid],pa.ModuleId ,allowedActions = count(1),    
totalActions= (Select count(1) from uaa_actions where moduleid = pa.[moduleid] and [isPublic] = 0)    
FROM uac_policy_actions pa    
WHERE pa.policyid = @policyid    
GROUP BY pa.policyid,pa.moduleid    
    
    
END    
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_getRoles]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_getRoles]  --null,2
@IsDeleted bit  
,@RoleId int  
AS  
BEGIN  
SET NOCOUNT ON;  
if(@isDeleted is not null and @roleid is null )  
begin  
select g.[roleid],g.[roleName],g.[isActive],g.[createdBy],g.[createdOn],g.[ip] 
from uac_role g   
where g.[isDeleted] = @isDeleted  
end  
else  
begin  
  
select g.[roleid],g.[roleName],g.[isActive],g.[createdBy],g.[createdOn],g.[ip]
from uac_role g   
where (g.[isDeleted] = @isDeleted  Or @isDeleted is null)
AND g.roleid = @roleid   
  
  
select g.[rpid],g.[roleid],g.[policyid],p.[policyName]  
from [uac_role_policies] g  
inner join [uac_policy] p on p.[policyid] = g.[policyid]  
where g.[roleid] = @roleid  
  
  
  
end  
END  
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_Login]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE  PROCEDURE [dbo].[usp_uac_Login]    
@UserName varchar(200),  
@Password varchar(200)  
AS  
BEGIN      
if exists(SELECT Top 1  [userName] FROM [uac_user] WHERE [userName] = @UserName and [password] = @Password )  
 begin   
  if exists(SELECT Top 1 [userName] FROM [uac_user] WHERE [userName] = @UserName and [password] = @Password and [isActive] = 0 )   
   begin   
    SELECT 'User is inactive by administrator' as msg,2 as msgType, returnId=0  
   end  
   else if exists(SELECT Top 1 [email] FROM [uac_user] WHERE [userName] = @UserName and [password] = @Password and [isDeleted] = 1 )   
   begin   
    SELECT 'User does not exists' as msg,2 as msgType, returnId=0

   end  

  else  

   begin  

    SELECT 'Valid user' as msg,1 as msgType, userid as returnId FROM [uac_user] WHERE [userName] = @UserName and [password] = @Password

   end  

 end  

else  

 begin  

  SELECT 'Invalid userName or password' as msg,2 as msgType, returnId =0  

 end  

END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_policy_AllowActions]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_policy_AllowActions]
@PolicyId int
,@ModuleId int
,@ActionId int
AS
BEGIN
-- SET NOCOUNT ON added to prevent extra result sets from
-- interfering with SELECT statements.
SET NOCOUNT ON;
INSERT INTO [uac_policy_actions]([policyid],[moduleid],[actionid])
VALUES(@policyid,@moduleid,@actionid)
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_policy_AllowModules]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_policy_AllowModules]
@PolicyId int
,@ModuleId int
AS
BEGIN
-- SET NOCOUNT ON added to prevent extra result sets from
-- interfering with SELECT statements.
SET NOCOUNT ON;
INSERT INTO [uac_policy_modules]([policyid],[moduleid])
VALUES(@policyid,@moduleid)
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_restorePolicy]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[usp_uac_restorePolicy]
@PolicyId int
AS
BEGIN
SET NOCOUNT ON;
update uac_policy set [isDeleted] = 0 where [policyid] = @policyid
if exists(select 1 from uac_policy where [policyid] = @policyid and isDeleted = 1)
begin
SELECT 'Restore unsuccessful!' as msg,2 as msgType,@policyid as [policyid]
end
else
begin
SELECT 'Policy restored successfully' as msg,1 as msgType,@policyid as [policyid]
end
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_saveGroup]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_saveGroup]
@Roleid int
,@RoleName varchar(200)
,@IsActive bit
AS
BEGIN
SET NOCOUNT ON;
IF(@roleid=0 OR @roleid IS NULL)
BEGIN
if exists(SELECT 1 FROM uac_role WHERE roleName = @roleName)
begin
SELECT 'RoleName Name already exists' as msg,2 as msgType,@roleid as returnId
end
else
begin
INSERT INTO uac_role
([roleName],[isDeleted],[isActive])
VALUES
(@roleName,0,@isActive)
SET @roleid=SCOPE_IDENTITY()
SELECT 'Group created successfully' as msg,1 as msgType,@roleid as returnId
end
END
ELSE
BEGIN
IF EXISTS(SELECT 1 FROM uac_role WHERE roleName = @roleName AND roleid <> @roleid)
begin
SELECT 'Group Name already exists' as msg,2 as msgType,@roleid as returnId
end
else
begin
UPDATE uac_role
SET [roleName] = @roleName
,[isActive] = @isActive
WHERE roleid=@roleid
DELETE from [uac_role_policies] where roleid=@roleid
SELECT 'Group updated successfully' as msg,1 as msgType,@roleid as returnId
end
END
END
GO
/****** Object:  StoredProcedure [dbo].[usp_uac_savePolicy]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_uac_savePolicy]
@PolicyId int
,@PolicyName varchar(200)
,@Description varchar(5000)
,@IsActive bit
AS
BEGIN
SET NOCOUNT ON;
IF(@policyid=0 OR @policyid IS NULL)
BEGIN
if exists(SELECT 1 FROM uac_policy WHERE policyName = @policyName)
begin
SELECT 'Policy Name already exists' as msg,2 as msgType,@policyid as returnId
end
else
begin
INSERT INTO uac_policy
([policyName],[description],[isActive],[isDeleted])
VALUES
(@policyName,@description,@isActive,0)
SET @policyid=SCOPE_IDENTITY()
SELECT 'Policy created successfully' as msg,1 as msgType,@policyid as returnId
end

END
ELSE
BEGIN
IF EXISTS(SELECT 1 FROM uac_policy WHERE policyName = @policyName AND policyid <> @policyid)
begin
SELECT 'Policy Name already exists' as msg,2 as msgType,@policyid as returnId
end
else
begin
UPDATE uac_policy
SET [policyName] = @policyName
,[description] = @description
,[isActive] = @isActive
,[isDeleted] = 0
WHERE policyid=@policyid
DELETE from uac_policy_modules where policyid = @policyid
DELETE from uac_policy_actions where policyid = @policyid
SELECT 'Policy updated successfully' as msg,1 as msgType,@policyid as returnId
end

END
END
GO
/****** Object:  StoredProcedure [dbo].[usp_UpdateUserPassword]    Script Date: 08/05/2021 12:39:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[usp_UpdateUserPassword]
@Email varchar(50),
@NewPassword varchar(250)
AS
BEGIN
update uac_user
set [password] = @NewPassword
where email = @Email

select scope_Identity()

END
GO
USE [master]
GO
ALTER DATABASE [ERP] SET  READ_WRITE 
GO
