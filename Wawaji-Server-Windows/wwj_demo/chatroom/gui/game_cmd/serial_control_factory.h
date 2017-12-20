#pragma once
#include "serial_win32.h"
#include "serial_win32_wmq.h"
#include "serial_win32_jj.h"

namespace nim_wwj
{

	enum PRODUCTTYPE { ylt, wmq, jj };

	class SerialControlFactory
	{
	public:
		WwjControl* createWwjControl(PRODUCTTYPE type)
		{
			switch (type)
			{
			case ylt:
				return new WwjControl();
				break;
			case wmq:
				return new WwjControl_Wmq();
				break;
			case jj:
				return new WwjControl_jj();
			default:
				return new WwjControl();
				break;
			}
		}

	};
}
